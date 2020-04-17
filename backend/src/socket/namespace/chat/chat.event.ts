import { Service } from "typedi";
import { ChatService } from "../../../services/chat.service";
import { AuthSocket } from "../../../typings";
import { ChatListener } from "./chat.listener";

@Service()
export class ChatEvent {
  constructor(
    private chatService: ChatService,
  ) {}

  public async joinChatRoom(socket: AuthSocket) {
    try {
      const { decoded } = socket;

      const chatRooms = await this.chatService.getChatRoomByMemberIdx(decoded.memberIdx);

      for (const chatRoom of chatRooms) {
        socket.join(`chatroom-${chatRoom.idx}`);
      }

      socket.emit(ChatListener.joinRoom, {
        status: 0,
        message: '룸 연결 성공',
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 4,
      });
    }
  }

  public async creatChatRoom() {

  }

  public async inviteChatRoom() {

  }

  public async leaveChatRoom(socket: AuthSocket, data) {
    try {
      const { decoded } = socket;
      const { chatRoomIdx } = data;

      await this.chatService.leaveChatRoomByIdx(decoded.memberIdx, chatRoomIdx);

      // 채팅방의 인원이 1명일때, 채팅방을 비활성화 한다.

      socket.emit(ChatListener.leaveRoom, {
        status: 0,
        message: '채팅방을 나갔습니다',
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 4,
      });
    }
  }

  public sendMsg(socket: AuthSocket, data) {
    console.log(socket.decoded);
    console.log(data);

    socket.emit(ChatListener.receiveMsg, {
      status: 1,
      message: '메세지 응답',
    });
  }
}
