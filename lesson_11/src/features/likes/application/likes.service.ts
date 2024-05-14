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

    // const updatedCommentLikesInfoRes =
    //   await commentsService.updateCommentById(parentId, {
    //     likesInfo: {
    //       myStatus:
    //     }
    //   });

    await this.likesCommandsRepository.updateLike({
      parentId,
      userId,
      status,
    });

    console.log("updatedRes", updatedLikeRes);
  }
}

export const likesService = new LikesService(new LikesCommandsRepository());
