import { Service } from "typedi";
import { ChatService } from "../../../services/chat.service";
import { AuthSocket } from "../../../typings";
import { ChatListener } from "./chat.listener";

@Service()
export class ChatEvent {
  constructor(
    private chatService: ChatService,
  ) {}

  public joinChatRoom(socket: AuthSocket) {

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
