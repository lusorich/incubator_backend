import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../domain/like.entity';

@Injectable()
export class LikesQueryRepository {
  constructor(@InjectModel(Like.name) private LikeModel: Model<Like>) {}

  async getByParentId(parentId: string, user) {
    const like = await this.LikeModel.findOne({
      parentId,
      'user.login': user.login,
    });

    if (!like) {
      return null;
    }

    return like;
  }

  async getLikesByParentId(parentId: string) {
    return await this.LikeModel.find({ parentId });
  }
}
