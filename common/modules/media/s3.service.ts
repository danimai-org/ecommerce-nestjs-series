import { Media, StorageType } from 'common/entities/media.entity';
import { MediaServiceContract, S3File } from './media.interface';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Readable } from 'stream';

export class S3Service implements MediaServiceContract {
  storageType = StorageType.S3;
  logger = new Logger(S3Service.name);
  client: S3;
  bucket: string;

  constructor(
    private mediaRepository: Repository<Media>,
    private configService: ConfigService,
  ) {
    this.bucket = configService.get('storage.bucket');
    this.client = new S3({
      region: configService.get('storage.region'),
      credentials: {
        accessKeyId: configService.get('storage.accessKeyId'),
        secretAccessKey: configService.get('storage.secretAccessKey'),
      },
    });
  }

  async get(media: Media, res: Response, range?: string) {
    try {
      const response = await this.client.getObject({
        Bucket: this.bucket,
        Key: media.filename,
        Range: range,
        ResponseContentType: media.mimetype,
      });
      res.setHeader('content-length', response.ContentLength);
      res.setHeader('content-type', response.ContentType);
      res.setHeader('accept-ranges', response.AcceptRanges);
      res.setHeader('etag', response.ETag);
      res.status(response.$metadata.httpStatusCode);

      (response.Body as Readable).pipe(res);
    } catch {
      res.status(404).json({ message: 'Media not found.' });
    }
  }

  create(file: S3File) {
    return this.mediaRepository.save({
      filename: file.key,
      url: file.location,
      mimetype: file.contentType,
      size: file.size,
      storage_type: this.storageType,
    });
  }

  async delete(media: Media) {
    try {
      await this.client.deleteObject({
        Bucket: this.configService.get('storage.bucket'),
        Key: media.filename,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
