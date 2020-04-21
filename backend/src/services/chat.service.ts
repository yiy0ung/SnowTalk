import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ChatRoomRepository } from "../database/repositories/chat.repository";
import { ChatParticipantRepository } from "../database/repositories/chatParticipant.repository";
import { Member } from "../database/models/Member";
import { ChatRoom } from "../database/models/ChatRoom";
import { RoomType } from "../database/enum/ChatType";

@Service()
export class ChatService {
  constructor(
    @InjectRepository() private readonly chatRoomRepo: ChatRoomRepository,
    @InjectRepository() private readonly chatParticipantRepo: ChatParticipantRepository,
  ) {}

  public getChatRoomsByIdx(roomIdx: number, activation: 0|1) {
    return this.chatRoomRepo.getRoomsByIdx(roomIdx, activation);
  }

  public getChatRoomByMemberIdx(memberIdx: number) {
    return this.chatRoomRepo.getActiveRoomsByMemberIdx(memberIdx);
  }

  public changeRoomActivation(chatRoomIdx: number, activation: 0|1) {
    return this.chatRoomRepo.update({
      idx: chatRoomIdx,
    }, {
      activation,
    });
  }

  public async createChatRoom(title: string, type: string) {
    const roomType = type === String(RoomType.personal) ? RoomType.personal : RoomType.group;
    const room = await this.chatRoomRepo.save({
      title,
      type: roomType,
    });
    
    return room;
  }

  public async enterChatRoom(members: Member[], room: ChatRoom) {
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

  public async leaveChatRoomByIdx(member: Member, room: ChatRoom) {
    const chatMember = await this.chatParticipantRepo.getParticipant(member.idx, room.idx);

    if (!chatMember || chatMember.activation === 0) {
      return false;
    }

    // 참여 비활성화
    await this.chatParticipantRepo.changeMemberActivation(chatMember.idx, 0);

    const roomMembers = await this.chatParticipantRepo.find({
      where: {
        chatRoom: room.idx,
        activation: 1,
      },
    });;

    if (roomMembers.length <= 0) {  // 채팅방 비활성화
      await this.changeRoomActivation(room.idx, 0);
    }

    return true;
  }
}
