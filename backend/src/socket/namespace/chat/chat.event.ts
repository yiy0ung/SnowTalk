import { Service } from "typedi";

import { ChatNmsp } from "./chat.nmsp";
import { MessageEvent } from "./message.event";
import { ChatListener } from "./chat.listener";
import { ChatService } from "../../../services/chat.service";
import { MemberService } from "../../../services/member.service";
import { AuthSocket } from "../../../typings";
import * as Validate from '../../helper/validate';
import * as redisHelper from "../../helper/redis";
import * as messageHelper from "../../helper/message";

@Service()
export class ChatEvent {
  constructor(
    private memberService: MemberService,
    private chatService: ChatService,
    private messageEvent: MessageEvent,
  ) {}

  public async getChatRooms(socket: AuthSocket) {
    try {
      const { decoded } = socket;

      const rooms = await this.chatService.getChatRoomByMemberIdx(decoded.memberIdx);

      for (const room of rooms) {
        socket.join(`chatroom-${room.idx}`);
      }
      console.log(rooms);
      socket.emit(ChatListener.getRooms, {
        status: 200,
        data: {
          rooms,
        },
      });
      socket.emit('test', {
        status: 200,
        data: 'test',
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }

  public async creatChatRoom(socket: AuthSocket, data) {
    try {
      await Validate.createChatRoom(data);
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
      const { membersIdx, title, type } = data;

      const myInfo = await this.memberService.getMemberByIdx(decoded.memberIdx);
      const members = await this.memberService.getMembersByIdxes(membersIdx);
      const entryMember = [...members, myInfo];

      const room = await this.chatService.createChatRoom(title, type);
      const enterResult = await this.chatService.enterChatRoom(entryMember, room);

      if (enterResult === false) {
        socket.emit(ChatListener.createRoom, {
          status: 404,
          message: '채팅방 생성에 실패하였습니다',
        });

        return;
      }

      await redisHelper.joinChatRoom(ChatNmsp.instance, room.idx, entryMember);

      // 시스템 메시지 전송
      const message = messageHelper.invitingMsg(myInfo, members);
      await this.messageEvent.sendSystemMsg(socket, {
        message,
        room,
      });

      const payload = {
        status: 200,
        data: {
          room,
          members: entryMember,
        },
      };

      socket.emit(ChatListener.createRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.createRoom, payload);
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
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

      const enterResult = await this.chatService.enterChatRoom(members, room);

      if (enterResult === false) {
        socket.emit(ChatListener.inviteRoom, {
          status: 404,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      await redisHelper.joinChatRoom(ChatNmsp.instance, room.idx, members);

      // 시스템 메시지 전송
      const message = messageHelper.invitingMsg(myInfo, members);
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

      socket.emit(ChatListener.inviteRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.inviteRoom, payload);
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
      const message = messageHelper.leavingMsg(myInfo);
      await this.messageEvent.sendSystemMsg(socket, {
        message,
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
