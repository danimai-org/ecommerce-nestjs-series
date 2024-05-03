import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { paginate } from 'src/pagination/paginate';
import { PaginationResponse } from 'src/pagination/pagination-response';
import { PaginationQuery } from 'src/pagination/pagination.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  async getAll(user: User, paginationDto: PaginationQuery) {
    const queryBuilder = this.postRepository.createQueryBuilder('post');
    queryBuilder.where('post.user_id = :user_id', { user_id: user.id });
    paginate(queryBuilder, paginationDto);

    const [posts, total] = await queryBuilder.getManyAndCount();

    return new PaginationResponse(posts, total, paginationDto);
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
