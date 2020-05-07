import { Router } from 'express';
import { Container, Service } from 'typedi';

import authMiddleware from '../middlewares/auth.middleware';
import { AuthRoute } from './auth';
import { UploadRoute } from './upload';
import { MemberRoute } from './member';
import { ChatRoute } from './chat';

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
    this.router.use('/upload', Container.get(UploadRoute).getRouter());
    this.router.use('/chat', authMiddleware, Container.get(ChatRoute).getRouter());
  }

  public getRouter() {
    return this.router;
  }
}

export default RootRouter;
