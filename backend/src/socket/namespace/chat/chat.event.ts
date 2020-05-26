import { Service } from "typedi";
import { find } from 'lodash';

import { ChatNmsp } from "./chat.nmsp";
import { MessageEvent } from "./message.event";
import { ChatListener } from "./chat.listener";
import { ChatService } from "../../../services/chat.service";
import { MemberService } from "../../../services/member.service";
import { AuthSocket } from "../../../typings";
import * as Validate from '../../helper/validate';
import * as redisHelper from "../../helper/redis";
import * as messageHelper from "../../helper/message";
import { Member } from "../../../database/models/Member";

@Service()
export class ChatEvent {
  constructor(
    private memberService: MemberService,
    private chatService: ChatService,
    private messageEvent: MessageEvent,
  ) {}

  public async getChatRooms(socket: AuthSocket) {
    try {
      const { memberIdx } = socket.decoded;

      const rooms = await this.chatService.getRoomByMemberIdx(memberIdx);

      for (const room of rooms) {
        socket.join(`chatroom-${room.idx}`);
      }

      socket.emit(ChatListener.getRooms, {
        status: 200,
        data: {
          rooms,
        },
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }

  public async creatChatRoom(socket: AuthSocket, data) {
    try {
      await Validate.createChatRoom(data);
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.createRoom, {
        status: 400,
        message: '생성를 실패하였습니다',
      });

      return;
    }

    try {
      const { decoded } = socket;
      const { membersIdx, title, type } = data;

      const { user, invited, entire } = await this.memberService.getMembersDataByIdx({
        userIdx: decoded.memberIdx,
        membersIdx,
      });

      // 룸 생성(활성화) 및 멤버 추가
      const createdRoomIdx = await this.chatService.createChatRoom(title, type, entire);

      if (!createdRoomIdx) {
        socket.emit(ChatListener.createRoom, {
          status: 404,
          message: '채팅방 생성에 실패하였습니다',
        });

        return;
      }

      const [room] = await this.chatService.getRoomByIdxes(createdRoomIdx);

      await redisHelper.joinChatRoom(ChatNmsp.instance, room.idx, entire);

      const payload = {
        status: 200,
        data: {
          room,
        },
      };

      socket.emit(ChatListener.createRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.createdRoom, payload);
      
      // 시스템 메시지 전송
      const message = messageHelper.invitingMsg(user, invited);
      await this.messageEvent.sendSystemMsg(socket, {
        message,
        room,
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.createRoom, {
        status: 500,
      });
    }
  }

  public async inviteChatRoom(socket: AuthSocket, data) {
    try {
      await Validate.inviteChatRoom(data);
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.inviteRoom, {
        status: 400,
        message: '초대를 실패하였습니다',
      });

      return;
    }

    try {
      const { decoded } = socket;
      const { roomIdx, membersIdx } = data;

      const roomData = await this.chatService.getRoomByIdx(roomIdx);
      const { user, invited } = await this.memberService.getMembersDataByIdx({
        userIdx: decoded.memberIdx,
        membersIdx,
      });

      if (!roomData && invited.length <= 0) {
        socket.emit(ChatListener.inviteRoom, {
          status: 404,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      const participants = await this.chatService.enterChatRoom(invited, roomData);

      if (!participants) {
        socket.emit(ChatListener.inviteRoom, {
          status: 404,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      const [room] = await this.chatService.getRoomByIdxes(roomData.idx);

      const payload = {
        status: 200,
        data: {
          room,
          invitedParticis: participants,
        },
      };

      // 초대된 회원에게 룸정보 제공
      await redisHelper.sendData(ChatNmsp.instance, invited, ChatListener.invitedRoom, payload);

      // 기존에 있던 회원에게만
      socket.emit(ChatListener.inviteRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.inviteRoom, payload);

      await redisHelper.joinChatRoom(ChatNmsp.instance, room.idx, invited); // Room Join

      // 시스템 메시지 전송
      const message = messageHelper.invitingMsg(user, invited);
      await this.messageEvent.sendSystemMsg(socket, {
        room,
        message,
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.inviteRoom, {
        status: 500,
      });
    }
  }

  public async leaveChatRoom(socket: AuthSocket, data) {
    try {
      await Validate.leaveChatRoom(data);
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.leaveRoom, {
        status: 400,
        message: '나가기를 실패하였습니다(포멧)',
      });

      return;
    }

    try {
      const { decoded } = socket;
      const { roomIdx } = data;

      const user = await this.memberService.getMemberByIdx(decoded.memberIdx);
      const room = await this.chatService.getRoomByIdx(roomIdx);

      if (!room) {
        socket.emit(ChatListener.leaveRoom, {
          status: 404,
          message: '(없는 방) 나가기를 실패하였습니다',
        });

        return;
      }

      // 채팅방 나가기
      const { leavePartici, deletedRoom } = await this.chatService.leaveChatRoomByIdx(user, room);

      if (!leavePartici) {
        socket.emit(ChatListener.leaveRoom, {
          status: 404,
          message: '나가기를 실패하였습니다',
        });

        return;
      }

      const payload = {
        status: 200,
        data: {
          roomIdx: room.idx,
          leaveMemberIdx: user.idx,
          leaveParticiIdx: leavePartici.idx,
        },
      };

      socket.leave(`chatroom-${room.idx}`);

      socket.emit(ChatListener.leaveRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.leaveRoomMember, payload);

      // 시스템 메시지 전송
      if (deletedRoom === false) {
        const message = messageHelper.leavingMsg(user);
        await this.messageEvent.sendSystemMsg(socket, {
          message,
          room,
        });
      }
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.leaveRoom, {
        status: 500,
      });
    }
  }
}
