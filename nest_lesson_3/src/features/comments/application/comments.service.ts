import { Injectable } from '@nestjs/common';
import { CommentsCommandsRepository } from '../repositories/comments.repository.commands';
import { CommentsQueryRepository } from '../repositories/comments.repository.query';

@Injectable()
export class CommentsService {
  constructor(
    private commentsCommandsRepository: CommentsCommandsRepository,

    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async createCommentForPost({ content, userId, userLogin, postId }) {
    const createdComment =
      await this.commentsCommandsRepository.createCommentForPost({
        content,
        userId,
        userLogin,
        postId,
      });

    const outputComment = await this.commentsQueryRepository.getById(
      createdComment.id,
    );

    return outputComment;
  }
}