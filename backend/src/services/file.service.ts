import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { File } from "../database/models/File";

@Service()
export class FileService {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
  ) {}

  public async createImg(fileName: string, extend: string) {
    const file = await this.fileRepo.save({
      name: fileName,
      extend,
    });

    return file;
  }
}
