import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { MediaModule } from '../../media/media.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../media/multer_config.service';

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
