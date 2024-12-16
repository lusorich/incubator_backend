import { Injectable } from '@nestjs/common';
import { CommentsCommandsRepository } from '../repositories/comments.repository.commands';
import { CommentsQueryRepository } from '../repositories/comments.repository.query';
import { LikesService } from 'src/features/likes/application/likes.service';
import { LIKE_STATUS } from 'src/common/enums';

@Injectable()
export class CommentsService {
  constructor(
    private commentsCommandsRepository: CommentsCommandsRepository,
    private likesService: LikesService,
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

  async getCommentWithCurrentUserLikeStatus({ id, user }) {
    const comment = await this.commentsQueryRepository.getById(id);

    if (user) {
      const userLike = await this.likesService.getLikesByUserAndParentId({
        parentId: id,
        user,
      });

      comment.likesInfo.likeStatus = userLike.likeStatus;

      return comment;
    }

    return comment;
  }

  async updateCommentLikeStatus({ id, likeStatus, user }) {
    return await this.likesService.updateLike({
      parentId: id,
      likeStatus,
      user,
    });
  }

  async createCommentLikeStatus({ id, user, likeStatus }) {
    return await this.likesService.createLike({
      user,
      parentId: id,
      likeStatus,
    });
  }

  async recalculateLikes({ parentId }) {
    const allCommentLikes = await this.likesService.getLikesByParentId({
      parentId,
    });

    const likes = allCommentLikes.filter(
      (like) => like.likeStatus === LIKE_STATUS.Like,
    );
    const dislikes = allCommentLikes.filter(
      (like) => like.likeStatus === LIKE_STATUS.Dislike,
    );

    return await this.commentsCommandsRepository.updateCommentLikes({
      likes: likes.length,
      dislikes: dislikes.length,
      id: parentId,
    });
  }

  async updateComment({ id, content }) {
    return await this.commentsCommandsRepository.updateComment({ id, content });
  }

  async deleteComment({ id }) {
    return await this.commentsCommandsRepository.deleteComment({ id });
  }
}
