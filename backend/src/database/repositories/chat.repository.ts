import { Repository, EntityRepository, TransactionManager, EntityManager } from "typeorm";
import { Service } from "typedi";
import { ChatRoom } from "../models/ChatRoom";
import { RoomType } from "../enum/ChatType";

@Service()
@EntityRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {

  public createRoom(@TransactionManager() manager: EntityManager, {
    title, type, personalCode
  }: { title: string, type: RoomType, personalCode: string|null }) {
    const room = new ChatRoom();
    room.title = title;
    room.type = type;
    room.activation = 1;
    room.personalCode = personalCode;

    return manager.save(room);
  }

  public async existPersonalChatRoom(personalCode: string) {
    const result = await this.createQueryBuilder('chatRoom')
      .where('chatRoom.type = :type', { type: RoomType.personal })
      .andWhere('chatRoom.personalCode = :personalCode', { personalCode })
      .getOne();

    return result;
  }

  public updateRoomInfo(idx: number, {
    title,
    activation,
  }: { title: string, activation: 0|1 }) {
    return this.update({
      idx,
    }, {
      title,
      activation,
    });
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
