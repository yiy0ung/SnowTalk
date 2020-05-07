import { Repository, EntityRepository, In } from "typeorm";
import { Service } from "typedi";
import { ChatParticipant } from "../models/ChatParticipant";
import { Member } from "../models/Member";
import { ChatRoom } from "../models/ChatRoom";

@Service()
@EntityRepository(ChatParticipant)
export class ChatParticipantRepository extends Repository<ChatParticipant> {
  
  public createParticipant(member: Member, chatRoom: ChatRoom) {
    return this.save({
      member,
      chatRoom,
      activation: 1,
    });
  }

  public getParticipant(memberIdx: number, chatRoomIdx: number) {
    return this.findOne({
      where: {
        member: memberIdx,
        chatRoom: chatRoomIdx,
      },
    });
  }

  public getParticipantByRoomIdxs(roomIdxs: readonly number[]) {
    return this.find({
      join: {
        alias: 'chatParticipant',
        leftJoinAndSelect: {
          member: 'chatParticipant.member',
          profileImg: 'member.profileImg',
        },
      },
      where: {
        chatRoom: In([...roomIdxs]),
      },
    });
  }

  public getExistParticipant(roomIdx: number, memberIdxs: number[]) {
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

  public changeMemberActivation(participantIdx: number, activation: 0|1) {
    return this.update({
      idx: participantIdx,
    }, {
      activation,
    });
  }
}
