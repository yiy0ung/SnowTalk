import { Repository, EntityRepository, In, TransactionManager, EntityManager } from "typeorm";
import { Service } from "typedi";
import { ChatParticipant } from "../models/ChatParticipant";
import { Member } from "../models/Member";
import { ChatRoom } from "../models/ChatRoom";

@Service()
@EntityRepository(ChatParticipant)
export class ChatParticipantRepository extends Repository<ChatParticipant> {

  public createParticipant(@TransactionManager() manager: EntityManager, {
      member, room,
    }: { member: Member, room: ChatRoom }) {
    const participant = new ChatParticipant();
    participant.member = member;
    participant.chatRoom = room;
    participant.activation = 1;

    return manager.save(participant);
  }

  public getParticipant(memberIdx: number, chatRoomIdx: number) {
    return this.findOne({
      where: {
        member: memberIdx,
        chatRoom: chatRoomIdx,
      },
    });
  }

  public getParticipantsFull(membersIdx: number[], chatRoomIdx: number) {
    return this.find({
      join: {
        alias: 'chatParticipant',
        leftJoinAndSelect: {
          member: 'chatParticipant.member',
          profileImg: 'member.profileImg',
        },
      },
      where: {
        member: In(membersIdx),
        chatRoom: chatRoomIdx,
      },
    });
  }

  public getParticipantByRoomIdx(roomIdx: number) {
    return this.find({
      join: {
        alias: 'chatParticipant',
        leftJoinAndSelect: {
          member: 'chatParticipant.member',
          profileImg: 'member.profileImg',
        },
      },
      where: {
        chatRoom: roomIdx,
      },
    });
  }

  public getExistParticipant(memberIdxs: number[], roomIdx: number) {
    return this.find({
      where: {
        chatRoom: roomIdx,
        member: In(memberIdxs),
        activation: 1,
      },
    }).then(data => {
      if (data.length > 0) {
        return true;
      }
      return false;
    });
  }

  public updateActivedMemberByRoomIdx(roomIdx: number, memberIdxs: number[], activation: 0|1) {
    return this.update({
      chatRoomIdx: roomIdx,
      member: In(memberIdxs),
    }, {
      activation,
    });
  }

  public changeMemberActivationTA(@TransactionManager() manager: EntityManager, {
    participantIdx, activation,
  }: { participantIdx: number, activation: 0|1 }) {
    return manager.update(ChatParticipant, {
      idx: participantIdx,
    }, {
      activation,
    });
  }
}
