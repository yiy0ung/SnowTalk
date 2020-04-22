import { EntityRepository, Repository } from "typeorm";
import moment from 'moment-timezone';

import { ChatMessage } from "../models/ChatMessage";
import { ChatRoom } from "../models/ChatRoom";
import { MessageType } from "../enum/ChatType";
import { Member } from "../models/Member";
import { File } from "../models/File";

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
}
