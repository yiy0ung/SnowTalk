import { Repository, EntityRepository } from "typeorm";
import { ChatRoom } from "../models/ChatRoom";

@EntityRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {

  public getChatRoomByMemberIdx(memberIdx: number) {
    return this.createQueryBuilder('chatRoom')
      .leftJoin('chatRoom.participants', 'chatParticipant')
      .where('chatParticipant.memberIdx = :memberIdx', { memberIdx })
      .getMany();
  }
}
