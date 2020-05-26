import { Service } from "typedi";
import { getConnection } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { map } from 'lodash';

import { ChatRoomRepository } from "../database/repositories/chat.repository";
import { ChatMessageRepository } from "../database/repositories/chatMessage.repository";
import { ChatParticipantRepository } from "../database/repositories/chatParticipant.repository";
import { Member } from "../database/models/Member";
import { ChatRoom } from "../database/models/ChatRoom";
import { RoomType } from "../database/enum/ChatType";
import { hashPersonalChatCode } from "../lib/method.lib";

@Service()
export class ChatService {
  constructor(
    @InjectRepository() private readonly chatRoomRepo: ChatRoomRepository,
    @InjectRepository() private readonly chatMsgRepo: ChatMessageRepository,
    @InjectRepository() private readonly chatParticipantRepo: ChatParticipantRepository,
  ) {}

  private async setChatRoomData(chatRooms: ChatRoom[]) {
    for (const room of chatRooms) {
      room.participants = await this.chatParticipantRepo.getParticipantByRoomIdx(room.idx, 1);
      room.messages = await this.chatMsgRepo.getMessageByChatRoomIdx(room.idx);
    }

    return chatRooms;
  }

  // 싱글 조회
  public getRoomByIdx(roomIdx: number) {
    return this.chatRoomRepo.getRoomsByIdx(roomIdx);
  }

  public async getRoomByIdxes(roomIdxes: number|number[]) {
    const idxes = typeof roomIdxes === 'number' ? [roomIdxes]: roomIdxes;
    const chatRooms = await this.chatRoomRepo.getRoomsByIdxes(idxes);
    
    await this.setChatRoomData(chatRooms);

    return chatRooms;
  }

  public async getRoomByMemberIdx(memberIdx: number) {
    const chatRooms = await this.chatRoomRepo.getRoomsByMemberIdx(memberIdx);
    
    await this.setChatRoomData(chatRooms);

    return chatRooms;
  }

  public async createChatRoom(title: string, type: string, members: Member[]) {
    let personalCode = null;
    const roomType = (type === String(RoomType.personal) && members.length === 2) ? 
      RoomType.personal : RoomType.group;

    if (roomType === RoomType.personal) { // 개인 채팅방은 1개만 활성화 가능
      personalCode = hashPersonalChatCode(members.map(member => member.idx));
      const room = await this.chatRoomRepo.getPersonalRoom(personalCode);
      
      if (room) {
        return room.idx;
      }
    }

    // start transaction - create new Chat Room
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const room = await this.chatRoomRepo.createRoom(queryRunner.manager, {
        title,
        type: roomType,
        personalCode,
      });

      for (const member of members) {
        await this.chatParticipantRepo.createParticipant(queryRunner.manager, {
          member, room,
        });
      }

      await queryRunner.commitTransaction(); // commit

      return room.idx;
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

    // start transaction - 회원 생성 및 활성화
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
  
      const participants = await this.chatParticipantRepo.getParticipantsFull(idxes, room.idx);
  
      return participants;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction(); // rollback

      return null;
    } finally {
      await queryRunner.release();
    }
  }

  public async leaveChatRoomByIdx(member: Member, room: ChatRoom) {
    let deletedRoom = false;
    const leavePartici = await this.chatParticipantRepo.getParticipant(member.idx, room.idx);

    if (!leavePartici || leavePartici.activation === 0) {
      return null;
    }

    // 자신 참여 비활성화
    await this.chatParticipantRepo.updateActivedMemberByRoomIdx(room.idx, [member.idx], 0);

    const memberIdxs = await this.chatParticipantRepo.find({
      where: {
        chatRoom: room.idx,
        activation: 1,
      },
    }).then(participants => participants.map(partici => partici.memberIdx));

    // 채팅방 삭제
    if (memberIdxs.length <= 0) {  // 개인 채팅방에 회원이 1명 이하 일때,
      await this.chatRoomRepo.deleteRoomByIdx(room.idx);
      deletedRoom = true;
    }

    return {
      deletedRoom,
      leavePartici,
    };
  }
}
