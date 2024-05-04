import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'common/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { MediaModule } from '../../../../common/modules/media/media.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../../../common/modules/media/multer_config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MediaModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
