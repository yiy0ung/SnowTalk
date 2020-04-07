import { Router } from "express";
import { Service } from "typedi";
import { UploadCtrl } from "./upload.ctrl";
import { uploader } from '../../lib/upload.lib';

@Service()
export class UploadRoute {
  private router: Router;

  constructor(
    private uploadCtrl: UploadCtrl,
  ) {
    this.router = Router();
    this.setRouter();
  }

  private setRouter() {
    this.router.post('/image', uploader.array('image'), this.uploadCtrl.uploadImgs);
  }

  public getRouter() {
    return this.router;
  }
}
