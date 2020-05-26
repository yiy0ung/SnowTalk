import { Message, ChatRoom, Participant } from "utils/types/entity.type";

export enum ChatEvent {
  chatError = 'chat-error',
  sendMsg = 'send-message',
  receiveMsg = 'receive-message',
  addRoomMember = 'add-room-member',
  getRooms = 'get-rooms',
  createRoom = 'create-room', // 방 생성 한 사람
  createdRoom = 'created-room', // 방 생성시 초대된 회원
  inviteRoom = 'invite-room', // 방 초대 한 사람 & 기존에 있던 회원
  invitedRoom = 'invited-room', // 방에 초대된 회원
  leaveRoom = 'leave-room', // 방 떠남
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
  room: ChatRoom;
};

export type LeaveRoomData = {
  roomIdx: number,
  leaveMemberIdx: number,
  leaveParticiIdx: number,
};

export type InviteRoomPayload = {
  roomIdx: number;
  membersIdx: number[];
};

export type InviteRoomData = {
  room: ChatRoom;
  invitedParticis: Participant[];
};

