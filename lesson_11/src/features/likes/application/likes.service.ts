import { commentsService } from "../../../domain/services/comments.service";
import { LikeDb } from "../domain/like.entity";
import { LikesCommandsRepository } from "../repositories/likes.commands.repository";

export class LikesService {
  constructor(private likesCommandsRepository: LikesCommandsRepository) {}

  async updateLike({ parentId, userId, status }: LikeDb) {
    const updatedLikeRes = await this.likesCommandsRepository.updateLike({
      parentId,
      userId,
      status,
    });

    await commentsService.recalculateLikes(parentId, userId);
  }
}

export const likesService = new LikesService(new LikesCommandsRepository());
