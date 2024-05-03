import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/modules/auth/email.dto';
import { UserUpdateDto } from './user.dto';
import { MediaService } from '../media/media.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mediaService: MediaService,
  ) {}

  async create(
    userCreateDto:
      | RegisterDto
      | Pick<User, 'email_verified_at' | 'is_active' | 'provider'>,
  ) {
    const user = User.create({ ...userCreateDto });
    return this.userRepository.save(user);
  }

  async update(
    user: User,
    avatar: Express.Multer.File,
    updateDto: UserUpdateDto,
  ) {
    const updateData: Record<string, string> = {
      ...updateDto,
    };
    const previousImage = user.avatar_id;
    if (avatar) {
      updateData.avatar_id = (await this.mediaService.update(avatar)).id;
    }

    await this.userRepository.update(user.id, updateData);
    if (avatar && updateData.avatar_id !== previousImage) {
      await this.mediaService.deleteMedia(previousImage);
    }

    return plainToInstance(User, {
      ...user,
      ...updateData,
    });
  }
}
