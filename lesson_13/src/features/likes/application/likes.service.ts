import { commentsService } from '../../../domain/services/comments.service';
import { postsService } from '../../posts/application/posts.service';
import { LikeDb } from '../domain/like.entity';
import { LikesCommandsRepository } from '../repositories/likes.commands.repository';

export class LikesService {
  constructor(private likesCommandsRepository: LikesCommandsRepository) {}

  async updateLike({ parentId, userId, status, login }: LikeDb) {
    await this.likesCommandsRepository.updateLike({
      parentId,
      userId,
      status,
    });

    await commentsService.recalculateLikes(parentId, userId);
    await postsService.recalculateLikes(parentId, login);
  }
}

export const likesService = new LikesService(new LikesCommandsRepository());
