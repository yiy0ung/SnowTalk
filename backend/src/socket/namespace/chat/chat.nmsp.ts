import { Service } from "typedi";
import { Namespace } from "socket.io";
import { autobind } from 'core-decorators';
import { ChatEvent } from "./chat.event";
import { ChatListener } from './chat.listener';
import * as tokenLib from '../../../lib/token.lib';
import { AuthSocket } from "../../../typings";

@autobind
@Service()
export class ChatNmsp {
  public static instance: Namespace = null;

  constructor(
    private chatEvent: ChatEvent,
  ) {}

  public handleingEvent(socket: AuthSocket) {
    const token = socket.handshake.query['token'];

    try {
      const decoded = tokenLib.verifyToken(token);
      socket.decoded = decoded;

      socket.on(ChatListener.joinRoom, () => this.chatEvent.joinChatRoom(socket));
      socket.on(ChatListener.sendMsg, (data) => this.chatEvent.sendMsg(socket, data));
    } catch (error) {
      console.error('채팅 에러 발생');
      console.error(error);

      socket.disconnect();
    }

    socket.on('disconnect', () => {
      console.log(`채팅 소켓 연결 끊킴\n${socket.decoded}`);
    });
  }
}
