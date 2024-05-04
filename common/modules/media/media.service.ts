import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from 'common/entities/media.entity';
import { MediaServiceContract } from './media.interface';
import { S3Service } from './s3.service';
import { LocalService } from './local.service';
import { Response } from 'express';

@Injectable()
export class MediaService {
  serviceHandler: MediaServiceContract;

  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private configService: ConfigService,
  ) {
    if (this.configService.get('storage.type') === 'S3') {
      this.serviceHandler = new S3Service(mediaRepository, configService);
    } else {
      this.serviceHandler = new LocalService(mediaRepository);
    }
  }

  async get(id: string, res: Response, range: string) {
    const media = await this.mediaRepository.findOneBy({ id });

    await this.serviceHandler.get(media, res, range);
  }

  async create(file: Express.Multer.File): Promise<Media> {
    return this.serviceHandler.create(file);
  }

  async update(file: Express.Multer.File, id?: string) {
    if (id) {
      const media = await this.mediaRepository.findOneBy({ id });
      this.serviceHandler.delete(media);
    }
    return this.serviceHandler.create(file);
  }

  async deleteMedia(id: string) {
    const media = await this.mediaRepository.findOneBy({ id });
    await this.serviceHandler.delete(media);
    await this.mediaRepository.delete(id);
  }
}
