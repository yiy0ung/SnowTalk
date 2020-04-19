import { Service } from "typedi";
import { Namespace } from "socket.io";
import { autobind } from 'core-decorators';

import * as tokenLib from '../../../lib/token.lib';
import { AuthSocket } from "../../../typings";
import { ChatListener } from './chat.listener';
import { ChatEvent } from "./chat.event";
import { MessageEvent } from "./message.event";

@autobind
@Service()
export class ChatNmsp {
  public static instance: Namespace = null;

  constructor(
    private chatEvent: ChatEvent,
    private messageEvent: MessageEvent,
  ) {}

  public handleingEvent(socket: AuthSocket) {
    const token = socket.handshake.query['token'];

    try {
      const decoded = tokenLib.verifyToken(token);
      socket.decoded = decoded;

      socket.on(ChatListener.joinRoom, () => this.chatEvent.joinChatRoom(socket));
      socket.on(ChatListener.sendMsg, (data) => this.messageEvent.sendMsg(socket, data));
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
