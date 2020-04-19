import { Repository, EntityRepository } from "typeorm";
import { ChatParticipant } from "../models/ChatParticipant";
import { Member } from "../models/Member";
import { ChatRoom } from "../models/ChatRoom";

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

  public changeMemberActivation(participantIdx: number, activation: 0|1) {
    return this.update({
      idx: participantIdx,
    }, {
      activation,
    });
  }
}
