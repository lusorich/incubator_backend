import { Injectable } from '@nestjs/common';
import { LikesCommandsRepository } from '../repositories/likes.repository.commands';
import { LikesQueryRepository } from '../repositories/likes.repository.query';

@Injectable()
export class LikesService {
  constructor(
    private likesCommandsRepository: LikesCommandsRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async createLike({ user, parentId, likeStatus }) {
    return this.likesCommandsRepository.createLike({
      user,
      parentId,
      likeStatus,
    });
  }

  async updateLike({ likeStatus, parentId, user }) {
    return this.likesCommandsRepository.updateLike({
      parentId,
      likeStatus,
      user,
    });
  }

  async getLikesByParentId({ parentId }) {
    return this.likesQueryRepository.getLikesByParentId(parentId);
  }

  async getLikesByUserAndParentId({ user, parentId }) {
    return this.likesQueryRepository.getByParentId(parentId, user);
  }
}
