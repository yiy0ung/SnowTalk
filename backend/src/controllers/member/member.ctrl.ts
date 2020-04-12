import { Service } from "typedi";
import { Response } from "express";
import { AuthRequest } from "../../typings";
import { MemberService } from "../../services/member.service";
import { FriendService } from "../../services/friend.service";

@Service()
export class MemberCtrl {
  constructor(
    private memberSerive: MemberService,
    private friendService: FriendService,
  ) {}
  
  public getMyInfo = async (req: AuthRequest, res: Response) => {
    const { memberIdx } = req.decoded;

    try {
      const myInfo = await this.memberSerive.getMemberByIdx(memberIdx);

      if (!myInfo) {
        res.status(404).json({
          status: 404,
          message: 'not found member info',
        });

        return;
      }

      res.status(200).json({
        status: 200,
        message: '회원 조회',
        data: {
          info: myInfo,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '회원 조회 실패'
      });
    }
  };

  public getFriends = async (req: AuthRequest, res: Response) => {
    const { memberIdx } = req.decoded;

    try {
      const followings = await this.friendService.getFollowingsInfo(memberIdx);

      res.status(200).json({
        status: 200,
        message: '친구 목록 조회',
        data: {
          friend: followings,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '친구 목록 실패'
      });
    }
  };

  public appendFriend = async (req: AuthRequest, res: Response) => {
    const { memberIdx } = req.decoded;
    let { friendId } = req.body;
    
    try {
      friendId = parseInt(friendId, 10);

      if (
        !Number.isInteger(friendId) 
        || Number.isNaN(friendId)
        || friendId <= 0
      ) {
        res.status(400).json({
          status: 400,
          message: '잘못된 친구 ID 입니다',
        });

        return;
      }

      const myInfo = await this.memberSerive.getMemberByIdx(memberIdx);

      if (myInfo.friendId === friendId) {
        res.status(400).json({
          status: 400,
          message: '자기자신을 친구 추가할 수 없습니다',
        });

        return;
      }

      const result = await this.friendService.appendFriend(memberIdx, friendId);

      if (!result) {
        res.status(404).json({
          status: 404,
          message: '존재하지 않는 회원입니다',
        });

        return;
      }

      res.status(200).json({
        status: 200,
        message: '친구 추가 성공'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '친구 추가 실패'
      });
    }
  };

  public removeFriend = async (req: AuthRequest, res: Response) => {
    const { memberIdx } = req.decoded;
    let { friend_idx: friendIdx } = req.query;

    try {
      friendIdx = parseInt(friendIdx, 10);

      if (
        !Number.isInteger(friendIdx) 
        || Number.isNaN(friendIdx)
        || friendIdx <= 0
      ) {
        res.status(400).json({
          status: 400,
          message: '잘못된 친구 INDEX 입니다',
        });

        return;
      }

      const result = await this.friendService.removeFriend(memberIdx, friendIdx);

      if (!result) {
        res.status(404).json({
          status: 404,
          message: '존재하지 않는 회원입니다',
        });

        return;
      }

      res.status(200).json({
        status: 200,
        message: '친구 삭제 성공',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '친구 삭제 실패',
      });
    }
  };
}
