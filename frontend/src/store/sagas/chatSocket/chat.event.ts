import { Message, ChatRoom, Participant } from "utils/types/entity.type";

export enum ChatEvent {
  chatError = 'chat-error',
  sendMsg = 'send-message',
  receiveMsg = 'receive-message',
  addRoomMember = 'add-room-member',
  getRooms = 'get-rooms',
  createRoom = 'create-room',
  inviteRoom = 'invite-room',
  leaveRoom = 'leave-room',
  leaveRoomMember = 'leave-room-member',
}

export type RequestMsgRecordData = {
  roomIdx: number;
  lastMessageIdx?: number;
};

export type ResponseMsgRecordData = {
  roomIdx: number;
  messages: Message[];
};

export interface ChatSocketResp<Data> {
  status: number;
  message?: string;
  data?: Data;
}

export type GetRoomData = {
  rooms: ChatRoom[];
};

export type SendFileMsgData = {
  roomIdx: number;
  message: string|null;
  file: File;
};

export type SendMsgData = {
  roomIdx: number;
  message: string|null;
  imageIdx?: number|null;
};

export type ReceiveMsgData = {
  roomIdx: number;
  message: Message;
};

export type CreateRoomPayload = {
  membersIdx: number[];
  title?: string;
  type: 'personal'|'group';
};

export type CreateRoomData = {
  roomIdx: number;
  room: ChatRoom;
  newMembers: Participant[];
};

export type LeaveRoomData = {
  roomIdx: number,
  memberIdx: number,
  participantIdx: number,
};

export type InviteRoomPayload = {
  roomIdx: number;
  membersIdx: number[];
};

export type InviteRoomData = {
  room: ChatRoom;
  newParticipants: Participant[];
};

