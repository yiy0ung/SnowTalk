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
    room.personalCode = personalCode;

    return manager.save(room);
  }

  public async getPersonalRoom(personalCode: string) {
    return this.createQueryBuilder('chatRoom')
      .where('chatRoom.type = :type', { type: RoomType.personal })
      .andWhere('chatRoom.personalCode = :personalCode', { personalCode })
      .getOne();
  }

  public updateRoomInfo(idx: number, {
    title
  }: { title: string }) {
    return this.update({
      idx,
    }, {
      title,
    });
  }

  public getRoomsByIdx(chatRoomIdx: number) {
    return this.findOne({
      where: {
        idx: chatRoomIdx,
      },
    });
  }

  public getRoomsByIdxes(idxes: number[]) {
    return this.createQueryBuilder('chatRoom')
      .where('chatRoom.idx IN (:idxes)', { idxes })
      .getMany();
  }

  public getRoomsByMemberIdx(memberIdx: number) {
    return this.createQueryBuilder('chatRoom')
      .leftJoin('chatRoom.participants', 'chatParticipant')
      .where('chatParticipant.member = :memberIdx', { memberIdx })
      .getMany();
  }
  
  public deleteRoomByIdx(roomIdx: number) {
    return this.delete({
      idx: roomIdx,
    });
  }
}
