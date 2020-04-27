import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";
import { ChatRoom } from "../models/ChatRoom";

@Service()
@EntityRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {
  public getRoomsByIdx(chatRoomIdx: number, activation: 0|1) {
    return this.findOne({
      where: {
        idx: chatRoomIdx,
        activation,
      },
    });
  }

  public getActiveRoomsByMemberIdx(memberIdx: number) {
    return this.createQueryBuilder('chatRoom')
      .leftJoin('chatRoom.participants', 'chatParticipant')
      .where('chatParticipant.member = :memberIdx', { memberIdx })
      .andWhere('chatRoom.activation = :active', { active: 1 })
      .andWhere('chatParticipant.activation = :active', { active: 1 })
      .getMany();
  }
}
