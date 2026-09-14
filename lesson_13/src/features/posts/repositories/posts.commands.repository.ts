import { ObjectId, WithId } from 'mongodb';

import { Post, PostModel, PostWithId } from '../domain/post.entity';
import { postsQueryRepository } from './posts.query.repository';
import { LikesQueryRepository } from '../../likes/repositories/likes.query.repository';
import { LIKE_STATUS } from '../../likes/domain/like.entity';
import { usersQueryRepository } from '../../users/repositories/users.query.repository';

export class PostsCommandsRepository {
  model: typeof PostModel;

  constructor() {
    this.model = PostModel;
  }

  async addPost(post: PostWithId) {
    const result = await this.model.create(post);

    return postsQueryRepository._mapToPostViewModel(
      result as WithId<PostWithId>,
    );
  }

  async updatePostById(id: PostWithId['id'], props: Partial<Post>) {
    let found = await this.model.updateOne({ _id: id }, { $set: { ...props } });

    if (!found.matchedCount) {
      return null;
    }

    return true;
  }

  async deletePostById(id: PostWithId['id']) {
    const found = await this.model.deleteOne({ _id: id });

    if (!found.deletedCount) {
      return false;
    }

    return true;
  }

  async recalculateLikes(postId: PostWithId['id'], login: string) {
    const queryR = new LikesQueryRepository();
    const allLikes = await queryR.getLikesByParentId(postId);

    const likes = allLikes.filter((like) => like.status === LIKE_STATUS.LIKE);
    const dislikes = allLikes.filter(
      (like) => like.status === LIKE_STATUS.DISLIKE,
    );

    const newestLikes = likes.filter((like, idx) => {
      if (idx !== 3) {
        return true;
      }
    });

    if (newestLikes.length > 0) {
      await Promise.all(
        newestLikes.map(async (like, index) => {
          const user = await usersQueryRepository.getUserById(like.userId);

          newestLikes[index] = {
            addedAt: like.addedAt,
            userId: like.userId,
            login: user?.login || '',
          };
        }),
      );
    }

    await this.model.updateOne(
      { _id: postId },
      {
        $set: {
          extendedLikesInfo: {
            likesCount: likes?.length || 0,
            dislikesCount: dislikes?.length || 0,
            myStatus: LIKE_STATUS.NONE,
            newestLikes: newestLikes.map((like) => ({
              addedAt: like.addedAt,
              userId: like.userId,
              login: like.login,
            })),
          },
        },
      },
    );
  }

  async clearPosts() {
    await this.model.deleteMany({});

    return this;
  }
}

export const postsCommandsRepository = new PostsCommandsRepository();
