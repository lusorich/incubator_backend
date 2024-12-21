import { Injectable } from '@nestjs/common';
import { PostsCommandsRepository } from '../repositories/posts.repository.commands';
import { CommentsService } from 'src/features/comments/application/comments.service';
import { CommentsQueryRepository } from 'src/features/comments/repositories/comments.repository.query';
import { LikesService } from 'src/features/likes/application/likes.service';
import { LIKE_STATUS } from 'src/common/enums';
import { PostsQueryRepository } from '../repositories/posts.repository.query';

@Injectable()
export class PostsService {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
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

  async getPosts({ paginationParams, user }) {
    const posts = await this.postsQueryRepository.getPosts({
      paginationParams,
    });

    if (user) {
      await new Promise((res) => {
        posts.items.map(async (post, index) => {
          const userLikeForPost =
            await this.likesService.getLikesByUserAndParentId({
              user,
              parentId: post.id,
            });

          if (userLikeForPost) {
            post.extendedLikesInfo.myStatus = userLikeForPost.likeStatus;
          }

          if (index === posts.items.length - 1) {
            res('');
          }
        });
      });
    }

    return posts;
  }

  async getPostComments({ paginationParams, id, user }) {
    const comments = await this.commentsQueryRepository.getPostComments({
      paginationParams,
      postId: id,
    });

    if (user) {
      await new Promise((res) => {
        comments.items.map(async (comment, index) => {
          const userLikeForComment =
            await this.likesService.getLikesByUserAndParentId({
              user,
              parentId: comment.id,
            });

          if (userLikeForComment) {
            comment.likesInfo.myStatus = userLikeForComment.likeStatus;
          }

          if (index === comments.items.length - 1) {
            res('');
          }
        });
      });
    }

    return comments;
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
    const allPostLikes = await this.likesService.getLikesByParentId({
      parentId,
    });

    const likes = allPostLikes.filter(
      (like) => like.likeStatus === LIKE_STATUS.Like,
    );
    const dislikes = allPostLikes.filter(
      (like) => like.likeStatus === LIKE_STATUS.Dislike,
    );

    const newestLikes = likes.reduce((acc, val, index) => {
      if (index < 3) {
        acc.push({
          addedAt: val.createdAt,
          //@ts-ignore
          userId: val.user._id,
          userLogin: val.user.login,
        });
      }

      return acc;
    }, []);

    return await this.postsCommandsRepository.updatePostLike({
      likes: likes.length,
      dislikes: dislikes.length,
      id: parentId,
      newestLikes,
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
