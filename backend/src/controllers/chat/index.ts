import { Router } from "express";
import { Service } from "typedi";
import { ChatCtrl } from "./chat.ctrl";
import authMiddleware from "../../middlewares/auth.middleware";

@Service()
export class ChatRoute {
  private router: Router;

  constructor(
    private chatCtrl: ChatCtrl,
  ) {
    this.router = Router();
    this.setRouter();
  }

  private setRouter() {
    this.router.get('/msg', this.chatCtrl.getChatMessage);
  }

  public getRouter() {
    return this.router;
  }
}
