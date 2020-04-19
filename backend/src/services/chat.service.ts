import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ChatRoomRepository } from "../database/repositories/chat.repository";
import { ChatParticipantRepository } from "../database/repositories/chatParticipant.repository";
import { Member } from "../database/models/Member";

@Service()
export class ChatService {
  constructor(
    @InjectRepository() private readonly chatRoomRepo: ChatRoomRepository,
    @InjectRepository() private readonly chatParticipantRepo: ChatParticipantRepository,
  ) {}

  public getChatRoomByMemberIdx(memberIdx: number) {
    return this.chatRoomRepo.getActiveRoomsByMemberIdx(memberIdx);
  }

  public getParticipantsByRoomIdx(chatRoomIdx: number) {
    return this.chatParticipantRepo.find({
      where: {
        chatRoom: chatRoomIdx,
        activation: 1,
      },
    });
  }

  public changeRoomActivation(chatRoomIdx: number, activation: 0|1) {
    return this.chatRoomRepo.update({
      idx: chatRoomIdx,
    }, {
      activation,
    });
  }

  public async connectChatRoom(members: Member[], chatRoomIdx: number) {
    const room = await this.chatRoomRepo.getRoomsByIdx(chatRoomIdx, 1);

    if (!room && members.length <= 0) {
      return false;
    }

    for (const member of members) {
      const chatMember = await this.chatParticipantRepo.getParticipant(member.idx, room.idx);

      if (!chatMember) {
        await this.chatParticipantRepo.createParticipant(member, room);
      } else {
        await this.chatParticipantRepo.changeMemberActivation(chatMember.idx, 1);
      }
    }

    return true;
  }

  public async leaveChatRoomByIdx(member: Member, chatRoomIdx: number) {
    const room = await this.chatRoomRepo.getRoomsByIdx(chatRoomIdx, 1);
    const chatMember = await this.chatParticipantRepo.getParticipant(member.idx, room.idx);

    if (!chatMember || chatMember.activation === 0) {
      return false;
    }

    // 참여 비활성화
    await this.chatParticipantRepo.changeMemberActivation(chatMember.idx, 0);

    return true;
  }
}
