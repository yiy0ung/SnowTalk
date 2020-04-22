import { Service } from "typedi";
import { ChatListener } from "./chat.listener";
import { AuthSocket } from "../../../typings";
import { MessageService } from "../../../services/message.service";
import { MemberService } from "../../../services/member.service";
import { ChatRoom } from "../../../database/models/ChatRoom";
import * as Validate from "../../helper/validate";

@Service()
export class MessageEvent {
  constructor(
    private messageService: MessageService,
    private memberService: MemberService,
  ) {}

  public async sendSystemMsg(socket: AuthSocket, {
    room,
    message,
  }: { room: ChatRoom, message: string }) {
    try {
      const messageData = await this.messageService.saveSystemMsg(room, message);

      const payload = {
        status: 200,
        data: {
          roomIdx: room.idx,
          message: messageData,
        },
      };

      socket.emit(ChatListener.receiveMsg, payload);
      socket.broadcast
        .to(`chatroom-${room.idx}`)
        .emit(ChatListener.receiveMsg, payload);

      return messageData;
    } catch (error) {
      socket.emit(ChatListener.sendMsg, {
        status: 500,
      });
    }
  }

  public async sendMsg(socket: AuthSocket, data) {
    try {
      await Validate.sendRoomMessage(data);
    } catch (error) {
      socket.emit(ChatListener.sendMsg, {
        status: 400,
        message: '잘못된 요청 양식',
      });

      return;
    }

    try {
      const { decoded } = socket;
      const { roomIdx, imageIdx, message } = data;

      const sender = await this.memberService.getMemberByIdx(decoded.memberIdx);
      const { success, messageData, room } = await this.messageService.saveUserMsg({
        roomIdx,
        fileIdx: imageIdx,
        sender, 
        message,
      });

      if (!success) {
        socket.emit(ChatListener.sendMsg, {
          status: 404,
          message: '메세지를 보낼 수 없습니다',
        });

        return;
      }

      const payload = {
        status: 200,
        data: {
          roomIdx: room.idx,
          message: messageData,
        },
      };

      socket.emit(ChatListener.receiveMsg, payload);
      socket.broadcast
        .to(`chatroom-${room.idx}`)
        .emit(ChatListener.receiveMsg, payload);
    } catch (error) {
      socket.emit(ChatListener.sendMsg, {
        status: 500,
        message: '메시지 전송 실패',
      });
    }
  }
}
