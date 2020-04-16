import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ChatRoomRepository } from "../database/repositories/chat.repository";

@Service()
export class ChatService {
  constructor(
    @InjectRepository() private readonly chatRoomRepo: ChatRoomRepository
  ) {}

  public getChatRoomByMemberIdx(memberIdx: number) {
    return this.chatRoomRepo.getChatRoomByMemberIdx(memberIdx);
  }
}
