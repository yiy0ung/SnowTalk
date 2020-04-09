import { Repository, EntityRepository } from "typeorm"
import { Member } from "../models/Member";
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
}
