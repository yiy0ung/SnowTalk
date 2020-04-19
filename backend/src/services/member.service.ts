import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from 'typeorm-typedi-extensions';
import moment from 'moment-timezone';

import * as tokenLib from '../lib/token.lib';
import { Member } from "../database/models/Member";

@Service()
export class MemberService {
  constructor(
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
  ) {}

  public generateAccessToken(memberIdx: number, memberId: string) {
    const token = tokenLib.createToken(memberIdx, memberId);
    const refreshToken = tokenLib.createRefreshToken(memberIdx, memberId);

    return [token, refreshToken];
  }

  public async getMemberByIdx(memberIdx: number) {
    const member = await this.memberRepo.findOne({
      where: {
        idx: memberIdx,
      },
    });

    return member;
  }

  public async getMembersByIdxes(memberIdxes: number[]) {
    const members = await this.memberRepo.createQueryBuilder('member')
      .where('member.idx IN (:idxes)', { idxes: memberIdxes })
      .getMany();

    return members;
  }

  public async getMemberBySecurity(id: string, pw: string) {
    const member = await this.memberRepo.findOne({
      where: {
        id,
        pw,
      },
    });

    return member;
  }

  public async createMember(data: Partial<Member>) {
    let idx = 0;
    const dateValue = parseInt(moment().format('YYMMDD').toString(), 10);
    const lastMember = await this.memberRepo.findOne({
      order: {
        idx: 'DESC',
      },
    });
  
    if (lastMember) {
      idx = lastMember.idx;
    }

    const member = await this.memberRepo.save({
      friendId: dateValue + idx + 1,
      ...data,
    });

    return member;
  }

  public async updateMember(memberId: string, data: Pick<Member, 'name'|'intro'|'profileImg'>) {
    const result = await this.memberRepo.update({
      id: memberId,
    }, {
      name: data.name,
      intro: data.intro,
      profileImg: data.profileImg,
    });

    return result;
  }

  public async removeMember(id: string, pw: string) {
    const result = await this.memberRepo.delete({
      id, pw,
    });

    return result;
  }
}
