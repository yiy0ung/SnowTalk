import { Repository, EntityRepository } from "typeorm";
import { File } from "../models/File";

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  public async createImg(fileName: string, extend: string) {
    const file = await this.save({
      name: fileName,
      extend,
    });

    return file;
  }

  public async getFileByIdx(fileIdx: number|null): Promise<File|null> {
    if (!fileIdx) {
      return null;
    }

    const file = await this.findOne({
      where: {
        idx: fileIdx,
      },
    });

    return file;
  }
}
