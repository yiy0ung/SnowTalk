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
      const { decoded } = socket;

      const rooms = await this.chatService.getRoomByMemberIdx(decoded.memberIdx);

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
      socket.emit(ChatListener.inviteRoom, {
        status: 400,
        message: '초대를 실패하였습니다',
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

      // 룸 생성 및 멤버 추가
      const { created, roomData } = await this.chatService.createChatRoom(title, type, entire);
      console.log(roomData);
      if (!created) {
        socket.emit(ChatListener.createRoom, {
          status: 404,
          message: '채팅방 생성에 실패하였습니다',
          data: {
            roomIdx: roomData.idx,
          },
        });

        return;
      }

      const [room] = await this.chatService.getRoomByIdxes(roomData.idx);

      await redisHelper.joinChatRoom(ChatNmsp.instance, room.idx, entire);

      const payload = {
        status: 200,
        data: {
          host: user,
          room,
          roomIdx: room.idx,
        },
      };

      socket.emit(ChatListener.createRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.createRoom, payload);
      
      // 시스템 메시지 전송
      const message = messageHelper.invitingMsg(user, invited);
      await this.messageEvent.sendSystemMsg(socket, {
        message,
        room,
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
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

      const roomData = await this.chatService.getChatRoomByIdx(roomIdx, 1);
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

      const { result, newMembers } = await this.chatService.enterChatRoom(invited, roomData);

      if (result === false) {
        socket.emit(ChatListener.inviteRoom, {
          status: 404,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      const [room] = await this.chatService.getRoomByIdxes([roomData.idx]);

      await redisHelper.joinChatRoom(ChatNmsp.instance, room.idx, invited);

      const payload = {
        status: 200,
        data: {
          room,
          newParticipants: newMembers,
        },
      };

      socket.emit(ChatListener.inviteRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.inviteRoom, payload);

      // 시스템 메시지 전송
      const message = messageHelper.invitingMsg(user, invited);
      await this.messageEvent.sendSystemMsg(socket, {
        room,
        message,
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }

  public async leaveChatRoom(socket: AuthSocket, data) {
    try {
      await Validate.leaveChatRoom(data);
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
      const { roomIdx } = data;

      const user = await this.memberService.getMemberByIdx(decoded.memberIdx);
      const room = await this.chatService.getChatRoomByIdx(roomIdx, 1);

      if (!room) {
        socket.emit(ChatListener.inviteRoom, {
          status: 404,
          message: '초대를 실패하였습니다',
        });

        return;
      }

      // 채팅방 나가기
      const leaveParticipant = await this.chatService.leaveChatRoomByIdx(user, room);

      if (!leaveParticipant) {
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
          memberIdx: user.id,
          participantIdx: leaveParticipant.idx,
        },
      };

      socket.emit(ChatListener.leaveRoom, payload);
      socket.broadcast.to(`chatroom-${room.idx}`).emit(ChatListener.leaveRoomMember, payload);
      socket.leave(`chatroom-${room.idx}`);

      // 시스템 메시지 전송
      const message = messageHelper.leavingMsg(user);
      await this.messageEvent.sendSystemMsg(socket, {
        message,
        room,
      });
    } catch (error) {
      console.error(error);
      socket.emit(ChatListener.chatError, {
        status: 500,
      });
    }
  }
}
