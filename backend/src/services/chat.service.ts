import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { map } from 'lodash';

import { ChatRoomRepository } from "../database/repositories/chat.repository";
import { ChatMessageRepository } from "../database/repositories/chatMessage.repository";
import { ChatParticipantRepository } from "../database/repositories/chatParticipant.repository";
import { Member } from "../database/models/Member";
import { ChatRoom } from "../database/models/ChatRoom";
import { RoomType } from "../database/enum/ChatType";
import { ChatDataloader } from "./dataloader/chat.dataloader";
import { getConnection } from "typeorm";

@Service()
export class ChatService {
  constructor(
    private chatDataloader: ChatDataloader,
    @InjectRepository() private readonly chatRoomRepo: ChatRoomRepository,
    @InjectRepository() private readonly chatMsgRepo: ChatMessageRepository,
    @InjectRepository() private readonly chatParticipantRepo: ChatParticipantRepository,
  ) {}

  public getChatRoomByIdx(roomIdx: number, activation: 0|1) {
    return this.chatRoomRepo.getRoomsByIdx(roomIdx, activation);
  }

  private async setChatRoomData(chatRooms: ChatRoom[]) {
    const chatRoomIdxs = map(chatRooms, 'idx');
    const participants = await this.chatDataloader.participantLoader.loadMany(chatRoomIdxs);

    for (let i = 0; i < chatRooms.length; i++) {
      const participantData = participants[i];

      if (!(participantData instanceof Error)) {
        chatRooms[i].participants = participantData;
      }
      chatRooms[i].messages = await this.chatMsgRepo.getMessageByChatRoomIdx(chatRooms[i].idx);
    }

    return chatRooms;
  }

  public async getRoomByIdxes(roomIdxes: number|number[]) {
    const idxes = typeof roomIdxes === 'number' ? [roomIdxes]: roomIdxes;
    const chatRooms = await this.chatRoomRepo.getRoomsByIdxes(idxes);
    
    await this.setChatRoomData(chatRooms);

    return chatRooms;
  }

  public async getRoomByMemberIdx(memberIdx: number) {
    const chatRooms = await this.chatRoomRepo.getActiveRoomsByMemberIdx(memberIdx);
    
    await this.setChatRoomData(chatRooms);

    return chatRooms;
  }

  public changeRoomActivation(chatRoomIdx: number, activation: 0|1) {
    return this.chatRoomRepo.update({
      idx: chatRoomIdx,
    }, {
      activation,
    });
  }

  public async createChatRoom(title: string, type: string, members: Member[]) {
    const roomType = type === String(RoomType.personal) ? RoomType.personal : RoomType.group;

    if (roomType === RoomType.personal && members.length === 2) { // 개인 채팅방은 1개만 활성화 가능
      const existence = await this.chatRoomRepo.existPersonalChatRoom(members);
      console.log(existence);
      if (existence.length > 0) {
        return {
          created: false,
          roomData: existence[0],
        };
      }
    }

    // start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const room = await this.chatRoomRepo.createRoom(queryRunner.manager, {
        title,
        type: roomType,
      });

      for (const member of members) {
        await this.chatParticipantRepo.createParticipant(queryRunner.manager, {
          member, room,
        });
      }

      await queryRunner.commitTransaction(); // commit

      return {
        created: true,
        roomData: room,
      };
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction(); // rollback

      return null;
    } finally {
      await queryRunner.release();
    }
  }

  public async enterChatRoom(members: Member[], room: ChatRoom) {
    const idxes = map(members, 'idx');
    const existMember = await this.chatParticipantRepo.getExistParticipant(
      idxes, room.idx);

    if (existMember) { // 초대하려는 회원이 이미 초대된 상태일 때
      return {
        result: false,
      };
    }

    // start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      for (const member of members) {
        let chatMember = await this.chatParticipantRepo.getParticipant(member.idx, room.idx);
  
        if (!chatMember) {
          await this.chatParticipantRepo.createParticipant(queryRunner.manager, {
            member, room,
          });
        } else {
          await this.chatParticipantRepo.changeMemberActivationTA(queryRunner.manager, {
            participantIdx: chatMember.idx,
            activation: 1,
          });
        }
      }

      await queryRunner.commitTransaction(); // commit
  
      const newMembers = await this.chatParticipantRepo.getParticipantsFull(idxes, room.idx);
  
      return {
        result: true,
        newMembers,
      };
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction(); // rollback

      return {
        result: false,
      };
    } finally {
      await queryRunner.release();
    }
  }

  public async leaveChatRoomByIdx(member: Member, room: ChatRoom) {
    const chatMember = await this.chatParticipantRepo.getParticipant(member.idx, room.idx);

    if (!chatMember || chatMember.activation === 0) {
      return null;
    }

    // 참여 비활성화
    await this.chatParticipantRepo.changeMemberActivation(chatMember.idx, 0);

    const roomMembers = await this.chatParticipantRepo.find({
      where: {
        chatRoom: room.idx,
        activation: 1,
      },
    });;

    // 채팅방 비활성화
    if (room.type === RoomType.personal && roomMembers.length <= 1) {  // 개인 채팅방에 회원이 1명일때,
      await this.changeRoomActivation(room.idx, 0);
    } else if (room.type === RoomType.group && roomMembers.length <= 0) { // 그룹 채팅방에 회원이 0명일떄,
      await this.changeRoomActivation(room.idx, 0);
    }

    return chatMember;
  }
}
