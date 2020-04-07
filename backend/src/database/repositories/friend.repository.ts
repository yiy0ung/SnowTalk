import { Repository, EntityRepository } from "typeorm"
import { Member } from "../models/Member";
import { Friend } from "../models/Friend";

@EntityRepository(Friend)
export class FriendRepository extends Repository<Friend> {
  public getFollowingsInfo(memberIdx: number) {
    return this.createQueryBuilder('friend')
      .leftJoinAndSelect('friend.following_member_idx', 'member')
      .leftJoinAndSelect('member.profileImg', 'file')
      .where('friend.follower_member_idx = :memberIdx', { memberIdx })
      .getMany();
  }
}
