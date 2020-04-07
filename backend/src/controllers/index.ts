import { Router } from 'express';
import { Container, Service } from 'typedi';
import { AuthRoute } from './auth';
import { UploadRoute } from './upload';
import authMiddleware from '../middlewares/auth.middleware';
import { MemberRoute } from './member';

@Service()
class RootRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRouter();
  }

  private setRouter() {
    this.router.use('/auth', Container.get(AuthRoute).getRouter());
    this.router.use('/member', authMiddleware, Container.get(MemberRoute).getRouter());
    this.router.use('/upload', authMiddleware, Container.get(UploadRoute).getRouter());
  }

  public getRouter() {
    return this.router;
  }
}

export default RootRouter;
