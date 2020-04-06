import { Router } from "express";
import { Service } from "typedi";
import { AuthCtrl } from "./auth.ctrl";
import authMiddleware from "../../middlewares/auth.middleware";

@Service()
export class AuthRoute {
  private router: Router;

  constructor(
    private authCtrl: AuthCtrl,
  ) {
    this.router = Router();
    this.setRouter();
  }

  private setRouter() {
    this.router.post('/login', this.authCtrl.login);
    this.router.post('/signup', this.authCtrl.signUp);
    this.router.post('/signout', authMiddleware, this.authCtrl.signOut);
    this.router.put('/', authMiddleware, this.authCtrl.updateProfile);
  }

  public getRouter() {
    return this.router;
  }
}
