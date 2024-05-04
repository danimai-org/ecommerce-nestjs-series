import { Controller, Get, Headers, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller({
  path: 'media',
  version: '1',
})
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get(':id')
  async getOne(
    @Res() res: Response,
    @Param('id') id: string,
    @Headers() headers?: Record<string, any>,
  ) {
    await this.mediaService.get(id, res, headers.range);
  }
}
