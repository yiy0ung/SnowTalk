import { Message, ChatRoom } from "utils/types/entity.type";

export enum ChatEvent {
  chatError = 'chat-error',
  sendMsg = 'send-message',
  receiveMsg = 'receive-message',
  addRoomMember = 'add-room-member',
  getRooms = 'get-rooms',
  createRoom = 'create-room',
  inviteRoom = 'invite-room',
  leaveRoom = 'leave-room',
}

export interface ChatSocketResp<Data> {
  status: number;
  message?: string;
  data?: Data;
}

export type GetRoomData = {
  rooms: ChatRoom[];
};

export type ReceiveMsgData = {
  roomIdx: number;
  message: Message;
};

