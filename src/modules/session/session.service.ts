import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  create(user: User) {
    return this.sessionRepository
      .create({
        user,
      })
      .save();
  }

  async get(id: string) {
    const session = await this.sessionRepository.findOneBy({
      id,
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async delete(id: string) {
    await this.sessionRepository.softDelete({
      id,
    });
  }
}
