import { Service } from "typedi";
import { ChatService } from "../../../services/chat.service";
import { AuthSocket } from "../../../typings";
import { ChatListener } from "./chat.listener";
import { MemberService } from "../../../services/member.service";
import { MessageEvent } from "./message.event";

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
      const { decoded } = socket;
      const { roomIdx, membersIdx } = data;

      const myInfo = await this.memberService.getMemberByIdx(decoded.memberIdx);
      const members = await this.memberService.getMembersByIdxes(membersIdx);

      const connectResult = await this.chatService.connectChatRoom(members, roomIdx);

      if (connectResult === false) {
        socket.emit(ChatListener.inviteRoom, {
          status: 400,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      let message = '';
      if (members.length > 1) {
        message = `${myInfo.name} 님이 ${members[0].name} 외 ${members.length - 1}명을 초대했습니다`;
      } else if (members.length === 1) {
        message = `${myInfo.name} 님이 ${members[0].name}님을 초대했습니다`;
      }

      // 시스템 메시지 전송
      await this.messageEvent.sendSystemMsg(socket, {
        message,
        roomIdx: roomIdx,
      });

      socket.emit(ChatListener.inviteRoom, {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }

  public async leaveChatRoom(socket: AuthSocket, data) {
    try {
      const { decoded } = socket;
      const { roomIdx } = data;

      const myInfo = await this.memberService.getMemberByIdx(decoded.memberIdx);

      // 채팅방 나가기
      const leaveResult = await this.chatService.leaveChatRoomByIdx(myInfo, roomIdx);

      if (leaveResult === false) {
        socket.emit(ChatListener.leaveRoom, {
          status: 404,
          message: '나가기를 실패하였습니다',
        });

        return;
      }

      const roomMembers = await this.chatService.getParticipantsByRoomIdx(roomIdx);

      if (roomMembers.length <= 1) {
        // 채팅방 비활성화
        await this.chatService.changeRoomActivation(roomIdx, 0);
      }

      // 시스템 메시지 전송
      await this.messageEvent.sendSystemMsg(socket, {
        message: `${myInfo.name} 님이 채팅방을 나갔습니다`,
        roomIdx: roomIdx,
      });

      socket.emit(ChatListener.leaveRoom, {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }
}
