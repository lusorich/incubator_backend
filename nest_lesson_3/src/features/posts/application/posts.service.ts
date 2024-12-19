import { Injectable } from '@nestjs/common';
import { PostsCommandsRepository } from '../repositories/posts.repository.commands';
import { CommentsService } from 'src/features/comments/application/comments.service';
import { CommentsQueryRepository } from 'src/features/comments/repositories/comments.repository.query';
import { LikesService } from 'src/features/likes/application/likes.service';
import { LIKE_STATUS } from 'src/common/enums';

@Injectable()
export class PostsService {
  constructor(
    private postsCommandsRepository: PostsCommandsRepository,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private likesService: LikesService,
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

  async getPostComments({ paginationParams, id }) {
    return await this.commentsQueryRepository.getPostComments({
      paginationParams,
      postId: id,
    });
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

  async updatePostLikeStatus({ id, likeStatus, user }) {
    return await this.likesService.updateLike({
      parentId: id,
      likeStatus,
      user,
    });
  }

  async createPostLikeStatus({ id, user, likeStatus }) {
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

    return await this.postsCommandsRepository.updateCommentLikes({
      likes: likes.length,
      dislikes: dislikes.length,
      id: parentId,
    });
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
