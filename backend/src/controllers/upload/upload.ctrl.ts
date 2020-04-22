import path from 'path';
import { Response } from "express";
import { Service } from "typedi";
import { AuthRequest } from "../../typings";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { FileRepository } from '../../database/repositories/file.repository';

@Service()
export class UploadCtrl {
  constructor(
    @InjectRepository() private readonly fileRepo: FileRepository,
  ) {}

  public uploadImgs = async (req: AuthRequest, res: Response) => {
    const { files } = req;
    const imgs = [];

    if (files.length <= 0) {
      res.status(400).json({
        status: 400,
        message: '저장될 이미지가 없습니다',
      });

      return;
    }

    try {
      for (const [_, file] of Object.entries(files)) {
        const extname = path.extname(file.originalname).substr(1);
        const image = await this.fileRepo.createImg(file.filename, extname);

        imgs.push({ fileIdx: image.idx, fileName: image.name });
      }

      res.status(200).json({
        status: 200,
        message: '이미지 업로드 성공',
        data: {
          images: imgs,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '이미지 업로드 실패',
      });
    }
  };
}
