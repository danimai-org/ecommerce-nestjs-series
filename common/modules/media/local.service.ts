import { Media, StorageType } from 'common/entities/media.entity';
import { MediaServiceContract } from './media.interface';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Logger, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

export class LocalService implements MediaServiceContract {
  storageType = StorageType.LOCAL;
  logger = new Logger(LocalService.name);

  constructor(private mediaRepository: Repository<Media>) {}

  async get(media: Media, res: Response) {
    const file_path = path.join(media.url);

    if (!fs.existsSync(file_path)) {
      throw new NotFoundException();
    }
    const file = fs.createReadStream(file_path);
    res.setHeader('content-type', media.mimetype);
    file.pipe(res);
  }

  create(file: Express.Multer.File) {
    return this.mediaRepository.save({
      filename: file.filename,
      url: `/${file.destination}/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      storage_type: this.storageType,
    });
  }

  async delete(media: Media) {
    try {
      fs.unlinkSync(path.join(media.url));
      await this.mediaRepository.delete(media.id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
