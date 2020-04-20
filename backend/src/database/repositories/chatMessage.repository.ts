import { EntityRepository, Repository } from "typeorm";
import { ChatMessage } from "../models/ChatMessage";
import { ChatRoom } from "../models/ChatRoom";
import { MessageType } from "../enum/ChatType";

@EntityRepository(ChatMessage)
export class ChatMessageRepository extends Repository<ChatMessage> {
  
  public saveSystemMessage(room: ChatRoom, message: string) {
    return this.save({
      chatRoom: room,
      message,
      type: MessageType.system,
    });
  }
}
