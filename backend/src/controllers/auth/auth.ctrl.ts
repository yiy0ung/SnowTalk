import { Request, Response } from "express";
import { Service } from "typedi";
import { MemberService } from "../../services/member.service";
import * as Validate from '../../lib/validate.lib';
import { AuthRequest } from "../../typings";

@Service()
export class AuthCtrl {
  constructor(
    private memberService: MemberService,
  ) {}

  public login = async (req: Request, res: Response) => {
    const { body } = req;

    try {
      await Validate.login(body);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: 400,
        message: '잘못된 요청 형식',
      });

      return;
    }

    try {
      const { id, pw } = body;
      const member = await this.memberService.getMemberBySecurity(id, pw);

      if (!member) {
        res.status(404).json({
          status: 404,
          message: 'not existing member',
        });

        return;
      }

      const [token, refresh] = this.memberService.generateAccessToken(member.idx, member.id);

      res.status(200).json({
        status: 200,
        message: 'success login',
        data: {
          token,
          refresh,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'fail login from server error',
      });
    }
  };

  public signUp = async (req: Request, res: Response) => {
    const { body } = req;

    try {
      await Validate.signUp(body);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: 400,
        message: '잘못된 요청 형식',
      });

      return;
    }

    try {
      const member = await this.memberService.createMember(body);

      if (!member) {
        res.status(404).json({
          status: 404,
          message: '회원가입 불가',
        });

        return;
      }

      res.status(200).json({
        status: 200,
        message: '회원가입 성공',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'failed from server',
      });
    }
  };

  public signOut = async (req: AuthRequest, res: Response) => {
    const { memberId } = req.decoded;
    const { pw } = req.body;

    try {
      await Validate.login({
        id: memberId,
        pw,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: 400,
        message: '잘못된 요청 형식',
      });

      return;
    }

    try {
      await this.memberService.removeMember(memberId, pw);

      res.status(200).json({
        status: 200,
        message: '회원탈퇴 성공',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'failed from server',
      });
    }
  };

  public updateProfile = async (req: AuthRequest, res: Response) => {

  };
}
