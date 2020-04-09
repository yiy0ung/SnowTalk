import { Member } from "./entity.type";

export interface BasicResForm {
  status: number;
  message: string;
}

export interface LoginReq {
  id: string;
  pw: string;
};

export interface LoginRes {
  token: string;
  refresh: string;
}

export interface MembersInfoRes {
  member: Member,
  friends: Member[],
}
