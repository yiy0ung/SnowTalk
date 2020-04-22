import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FriendRepository } from "../database/repositories/friend.repository";
import { Repository } from "typeorm";
import { Member } from "../database/models/Member";

@Service()
export class FriendService {
  constructor(
    @InjectRepository() private readonly friendRepo: FriendRepository,
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
  ) {}

  public async getFollowingsInfo(memberIdx: number) {
    const followings = await this.friendRepo.getFollowingsInfo(memberIdx);

    return followings;
  }

  public async appendFriend(followerIdx: number, friendId: number) {
    const follower = await this.memberRepo.findOne({
      where: {
        idx: followerIdx,
      }
    });
    const friend = await this.memberRepo.findOne({
      where: {
        friendId,
      },
    });

    if (!follower || !friend) {
      return false;
    }

    const relationship = await this.friendRepo.getFriendRelation(follower.idx, friend.idx);

    if (relationship) {
      return false;
    }

    const result = await this.friendRepo.save({
      followerMember: follower,
      followingMember: friend,
    });

    return result;
  }

  public async removeFriend(followerIdx: number, followingIdx: number) {
    const follower = await this.memberRepo.findOne({
      where: {
        idx: followerIdx,
      }
    });
    const friend = await this.memberRepo.findOne({
      where: {
        idx: followingIdx,
      },
    });

    if (!follower || !friend) {
      return false;
    }

    const result = await this.friendRepo.delete({
      followerMember: follower,
      followingMember: friend,
    });

    return result;
  }
}