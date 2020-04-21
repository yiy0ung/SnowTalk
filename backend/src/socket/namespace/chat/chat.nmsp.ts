import { Service } from "typedi";
import { Namespace } from "socket.io";
import { autobind } from 'core-decorators';

import * as tokenLib from '../../../lib/token.lib';
import { AuthSocket } from "../../../typings";
import * as redisHelper from "../../helper/redis";
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

  public async handleingEvent(socket: AuthSocket) {
    const token = socket.handshake.query['token'];

    try {
      const decoded = tokenLib.verifyToken(token);
      socket.decoded = decoded;

      // save socket connection info to redis
      await redisHelper.registerSocket(ChatNmsp.instance, socket.decoded.memberId, socket.id);
    } catch (error) {
      console.error('채팅 에러 발생');
      console.error(error);

      socket.disconnect();
    }

    socket.on(ChatListener.getRooms, () => this.chatEvent.getChatRooms(socket));
    socket.on(ChatListener.createRoom, (data) => this.chatEvent.creatChatRoom(socket, data));
    socket.on(ChatListener.inviteRoom, (data) => this.chatEvent.inviteChatRoom(socket, data));
    socket.on(ChatListener.leaveRoom, (data) => this.chatEvent.leaveChatRoom(socket, data));
    socket.on(ChatListener.sendMsg, (data) => this.messageEvent.sendMsg(socket, data));
    socket.on('disconnect', async () => {
      console.log(`채팅 소켓 연결 끊킴 : ${socket.decoded}`);

      try {
        await redisHelper.disconnectSocket(ChatNmsp.instance, socket.decoded.memberId);
      } catch (error) {
        console.error(`소켓 회원 정보 삭제 실패 : ${error}`);
      }
    });
  }
}
