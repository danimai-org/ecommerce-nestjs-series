import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'common/entities/post.entity';
import { User } from 'common/entities/user.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { postPaginateConfig } from './post.pagination';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async getAll(user: User, query: PaginateQuery) {
    return paginate(
      {
        ...query,
        filter: {
          ...query.filter,
          user_id: user.id,
        },
      },
      this.postRepository,
      postPaginateConfig,
    );
  }

  create(createDto: Post, user: User) {
    return this.postRepository
      .create({
        ...createDto,
        user_id: user.id,
      })
      .save();
  }

  async update(post: Post, user: User, updateDto: Post) {
    if (post.user_id !== user.id) {
      throw new ForbiddenException('You are now allowed to edit this post.');
    }
    await this.postRepository.update({ id: post.id }, updateDto);

    return {
      ...post,
      ...updateDto,
    };
  }

  async delete(post: Post, user: User) {
    if (post.user_id !== user.id) {
      throw new ForbiddenException('You are now allowed to edit this post.');
    }
    await this.postRepository.delete(post.id);
  }
}
