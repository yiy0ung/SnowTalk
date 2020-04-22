import { Repository, EntityRepository } from "typeorm";
import { Friend } from "../models/Friend";

@EntityRepository(Friend)
export class FriendRepository extends Repository<Friend> {
  
  public getFollowingsInfo(memberIdx: number) {
    return this.createQueryBuilder('friend')
      .leftJoinAndSelect('friend.followingMember', 'member')
      .leftJoinAndSelect('member.profileImg', 'file')
      .where('friend.followerMember = :memberIdx', { memberIdx })
      .getMany();
  }

  public getFriendRelation(selfIdx: number, friendMemberIdx: number) {
    return this.findOne({
      where: {
        followerMember: selfIdx,
        followingMember: friendMemberIdx,
      },
    });
  }
}
