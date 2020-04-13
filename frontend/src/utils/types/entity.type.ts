
export interface Member {
  idx: number;
  id: string;
  friendId: string;
  name: string;
  intro: string;
  profileImg: object;
};

export interface InitMember extends Member {
  pw: string;
}
