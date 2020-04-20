import { Service } from "typedi";
import { ChatRoom } from "../database/models/ChatRoom";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ChatMessageRepository } from "../database/repositories/chatMessage.repository";

@Service()
export class MessageService {
  constructor(
    @InjectRepository() private readonly chatMsgRepo: ChatMessageRepository,
  ) {}
  
  public createSystemMsg(room: ChatRoom, message: string) {
    return this.chatMsgRepo.saveSystemMessage(room, message);
  }
}
