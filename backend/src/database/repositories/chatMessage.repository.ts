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
    const messageQuery = this.createQueryBuilder('chatMessage')
      .leftJoinAndSelect('chatMessage.member', 'member')
      .leftJoinAndSelect('member.profileImg', 'file')
      .where('chatMessage.chatRoom = :roomIdx', { roomIdx })
      .orderBy('chatMessage.idx', 'DESC')
      .addOrderBy('chatMessage.createAt', 'DESC')
      .limit(MESSAGE_LIMIT);

    if (lastMessageIdx) {
      return messageQuery.andWhere('chatMessage.idx < :lastMessageIdx', { lastMessageIdx })
        .getMany();
    }

    return messageQuery.getMany();
  }
}
