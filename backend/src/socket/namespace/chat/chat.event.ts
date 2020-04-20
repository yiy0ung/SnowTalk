import { Service } from "typedi";

import { MessageEvent } from "./message.event";
import { ChatListener } from "./chat.listener";
import { ChatService } from "../../../services/chat.service";
import { MemberService } from "../../../services/member.service";
import { AuthSocket } from "../../../typings";
import * as Validate from '../../helper/validate';

@Service()
export class ChatEvent {
  constructor(
    private memberService: MemberService,
    private chatService: ChatService,
    private messageEvent: MessageEvent,
  ) {}

  public async joinChatRoom(socket: AuthSocket) {
    try {
      const { decoded } = socket;

      const rooms = await this.chatService.getChatRoomByMemberIdx(decoded.memberIdx);

      for (const room of rooms) {
        socket.join(`chatroom-${room.idx}`);
      }

      socket.emit(ChatListener.joinRoom, {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }

  public async creatChatRoom() {

  }

  public async inviteChatRoom(socket: AuthSocket, data) {
    try {
      await Validate.inviteChatRoom(data);
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.inviteRoom, {
        status: 400,
        message: '초대를 실패하였습니다',
      });

      return;
    }

    try {
      const { decoded } = socket;
      const { roomIdx, membersIdx } = data;

      const myInfo = await this.memberService.getMemberByIdx(decoded.memberIdx);
      const members = await this.memberService.getMembersByIdxes(membersIdx);
      const room = await this.chatService.getChatRoomsByIdx(roomIdx, 1);

      if (!room && members.length <= 0) {
        socket.emit(ChatListener.inviteRoom, {
          status: 404,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      const connectResult = await this.chatService.connectChatRoom(members, roomIdx);

      if (connectResult === false) {
        socket.emit(ChatListener.inviteRoom, {
          status: 404,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      // 초대된 회원 중 온라인인 회원을 룸에 Join

      let message = '';
      if (members.length > 1) {
        message = `${myInfo.name} 님이 ${members[0].name} 외 ${members.length - 1}명을 초대했습니다`;
      } else if (members.length === 1) {
        message = `${myInfo.name} 님이 ${members[0].name}님을 초대했습니다`;
      }

      // 시스템 메시지 전송
      await this.messageEvent.sendSystemMsg(socket, {
        message,
        room,
      });

      const payload = {
        status: 200,
        data: {
          roomIdx: room.idx,
          members,
        }
      };

      socket.emit(ChatListener.addRoomMember, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.addRoomMember, payload);
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }

  public async leaveChatRoom(socket: AuthSocket, data) {
    try {
      await Validate.leaveChatRoom(data);
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.inviteRoom, {
        status: 400,
        message: '초대를 실패하였습니다',
      });

      return;
    }

    try {
      const { decoded } = socket;
      const { roomIdx } = data;

      const myInfo = await this.memberService.getMemberByIdx(decoded.memberIdx);
      const room = await this.chatService.getChatRoomsByIdx(roomIdx, 1);

      if (!room) {
        socket.emit(ChatListener.inviteRoom, {
          status: 404,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      // 채팅방 나가기
      const leaveResult = await this.chatService.leaveChatRoomByIdx(myInfo, room);

      if (leaveResult === false) {
        socket.emit(ChatListener.leaveRoom, {
          status: 404,
          message: '나가기를 실패하였습니다',
        });

        return;
      }

      // 시스템 메시지 전송
      await this.messageEvent.sendSystemMsg(socket, {
        message: `${myInfo.name} 님이 채팅방을 나갔습니다`,
        room,
      });

      const payload = {
        status: 200,
        data: {
          roomIdx: room.idx,
          memberId: myInfo.id,
        },
      };

      socket.emit(ChatListener.leaveRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.leaveRoom, payload);
      socket.leave(`chatroom-${room.idx}`);
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }
}
