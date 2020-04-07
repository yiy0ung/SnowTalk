import { Router } from "express";
import { Service } from "typedi";
import { MemberCtrl } from "./member.ctrl";

@Service()
export class MemberRoute {
  private router: Router;

  constructor(
    public memberCtrl: MemberCtrl,
  ) {
    this.router = Router();
    this.setRouter();
  }

  private setRouter() {
    this.router.get('/my', this.memberCtrl.getMyInfo);
    this.router.route('/friend')
      .get(this.memberCtrl.getFriends)
      .post(this.memberCtrl.appendFriend)
      .delete(this.memberCtrl.removeFriend);
  }

  public getRouter() {
    return this.router;
  }
}
