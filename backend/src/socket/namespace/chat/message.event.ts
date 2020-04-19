import { Service } from "typedi";
import { AuthSocket } from "../../../typings";
import { ChatListener } from "./chat.listener";

@Service()
export class MessageEvent {

  public sendSystemMsg(socket: AuthSocket, {
    message,
    roomIdx,  
  }: { message: string, roomIdx: number }) {
    // save a message to a database;

    const payload = {
      status: 200,
      data: {},
    };

    socket.broadcast
      .to(`chatroom-${roomIdx}`)
      .emit(ChatListener.receiveMsg, payload);

    return;
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
