import { Injectable } from '@nestjs/common';
import { PostsCommandsRepository } from '../repositories/posts.repository.commands';
import { CommentsService } from 'src/features/comments/application/comments.service';

@Injectable()
export class PostsService {
  constructor(
    private postsCommandsRepository: PostsCommandsRepository,
    private commentsService: CommentsService,
  ) {}

  async create({ title, shortDescription, content, blogId, blogName }) {
    const result = await this.postsCommandsRepository.create({
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    });

    return result.id;
  }

  async createCommentForPost({ content, postId, userId, userLogin }) {
    const createdComment = await this.commentsService.createCommentForPost({
      content,
      postId,
      userId,
      userLogin,
    });

    return createdComment;
  }

  async update({ newData, id }) {
    await this.postsCommandsRepository.update({ newData, id });
  }

  async delete(id: number) {
    const result = await this.postsCommandsRepository.delete(id);

    return result;
  }

  async deleteAll() {
    return await this.postsCommandsRepository.deleteAll();
  }
}
