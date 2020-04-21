import { Service } from "typedi";
import { AuthSocket } from "../../../typings";
import { ChatListener } from "./chat.listener";
import { ChatRoom } from "../../../database/models/ChatRoom";
import { MessageService } from "../../../services/message.service";
import { ChatNmsp } from "./chat.nmsp";

@Service()
export class MessageEvent {
  constructor(
    private messageService: MessageService,
  ) {}

  public async sendSystemMsg(socket: AuthSocket, {
    room,
    message,
  }: { room: ChatRoom, message: string }) {
    const messageData = await this.messageService.createSystemMsg(room, message);

    const payload = {
      status: 200,
      data: {
        roomIdx: room.idx,
        message: messageData,
      },
    };

    socket.broadcast
      .to(`chatroom-${room.idx}`)
      .emit(ChatListener.receiveMsg, payload);

    return messageData;
  }

  public sendMsg(socket: AuthSocket, data) {
    console.log(ChatNmsp.instance);
    console.log(socket.decoded);
    console.log(data);

    socket.emit(ChatListener.receiveMsg, {
      status: 1,
      message: '메세지 응답',
    });
  }
}
