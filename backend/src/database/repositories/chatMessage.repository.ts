import { EntityRepository, Repository, LessThan } from "typeorm";
import moment from 'moment-timezone';

import { ChatMessage } from "../models/ChatMessage";
import { ChatRoom } from "../models/ChatRoom";
import { MessageType } from "../enum/ChatType";
import { Member } from "../models/Member";
import { File } from "../models/File";

const MESSAGE_LIMIT = 40;

@EntityRepository(ChatMessage)
export class ChatMessageRepository extends Repository<ChatMessage> {
  
  public saveSystemMessage(room: ChatRoom, message: string) {
    return this.save({
      chatRoom: room,
      message,
      type: MessageType.system,
    });
  }

  public saveUserMessage(room: ChatRoom, message: string, sender: Member, file: File) {
    return this.save({
      chatRoom: room,
      message,
      member: sender,
      type: MessageType.user,
      file,
      createAt: moment().tz('Asia/Seoul').toString(),
    });
  }

  public getMessageByChatRoomIdx(roomIdx: number, lastMessageIdx?: number) {
    if (lastMessageIdx) {
      return this.find({
        where: {
          idx: LessThan(lastMessageIdx),
          chatRoom: roomIdx,
        },
        order: {
          idx: 'DESC',
          createAt: 'DESC',
        },
        take: MESSAGE_LIMIT,
      });
    }

    return this.find({
      where: {
        chatRoom: roomIdx,
      },
      order: {
        idx: 'DESC',
        createAt: 'DESC',
      },
      take: MESSAGE_LIMIT,
    });
  }
}
