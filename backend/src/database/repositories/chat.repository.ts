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

  public getActiveRoomsByIdx(roomIdxs: number[]) {
    return this.createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.participants', 'chatParticipant')
      .leftJoinAndSelect('chatParticipant.member', 'member')
      .where('chatRoom.idx IN (:roomIdxs)', { roomIdxs })
      .andWhere('chatRoom.activation = :active', { active: 1 })
      .getMany();
  }
}
