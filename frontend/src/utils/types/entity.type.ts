
export interface Member {
  idx: number;
  id: string;
  friendId: string;
  name: string;
  intro: string;
  profileImg: FileState|null;
};

export interface InitMember extends Member {
  pw: string;
}
export type ChatRoomType = 'personal'|'group';
export type ChatRoom = {
  idx: number;
  title: string|null;
  type: ChatRoomType;
  messages: Message[];
  participants: Participant[];
};

export type MessageType = 'user'|'system';
export type Message = {
  idx: number;
  message: string;
  type: MessageType,
  deleted: number;
  createAt: string;
  member?: Member;
  msgfile: FileState|null;
};

export type Participant = {
  idx: number;
  nickname?: string;
  activation: number;
  memberIdx: number;
  member: Member;
  chatRoomIdx: number;
};

export type SavedImg = {
  fileIdx: number;
  fileName: string;
};

export type FileState = {
  idx: number;
  name: string;
  extend: string;
};
