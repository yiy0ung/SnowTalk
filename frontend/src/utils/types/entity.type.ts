
export interface Member {
  idx: number;
  id: string;
  friendId: string;
  name: string;
  intro: string;
  profileImg: ProfileImg|null;
};

export interface InitMember extends Member {
  pw: string;
}

export type SavedImg = {
  fileIdx: number;
  fileName: string;
};

export type ProfileImg = {
  idx: number;
  name: string;
  extend: string;
}