import { Repository, EntityRepository, TransactionManager, EntityManager, Transaction } from "typeorm";
import { Service } from "typedi";
import { ChatRoom } from "../models/ChatRoom";
import { Member } from "../models/Member";
import { RoomType } from "../enum/ChatType";

@Service()
@EntityRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {

  public createRoom(@TransactionManager() manager: EntityManager, {
    title, type
  }: { title: string, type: RoomType }) {
    const room = new ChatRoom();
    room.title = title;
    room.type = type;
    room.activation = 1;

    return manager.save(room);
  }

  public async existPersonalChatRoom(members: Member[]) {
    const membersIdx = members.map(member => member.idx);

    const result = await this.createQueryBuilder('chatRoom')
      .leftJoin('chatRoom.participants', 'chatParticipant')
      .where('chatRoom.type = :type', { type: RoomType.personal })
      .andWhere('chatRoom.activation = :active', { active: 1 })
      .andWhere('chatParticipant.memberIdx IN (:idxes)', { idxes: membersIdx })
      .getMany();

    return result.length > 0 ? true : false;
  }

  public getRoomsByIdx(chatRoomIdx: number, activation: 0|1) {
    return this.findOne({
      where: {
        idx: chatRoomIdx,
        activation,
      },
    });
  }

  public getRoomsByIdxes(idxes: number[]) {
    return this.createQueryBuilder('chatRoom')
      .where('chatRoom.idx IN (:idxes)', { idxes })
      .andWhere('chatRoom.activation = :active', { active: 1 })
      .getMany();
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
