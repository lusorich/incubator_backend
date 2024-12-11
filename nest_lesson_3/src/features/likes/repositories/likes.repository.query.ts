import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../domain/like.entity';

@Injectable()
export class LikesQueryRepository {
  constructor(@InjectModel(Like.name) private LikeModel: Model<Like>) {}

  async getByParentId(parentId: string) {
    const like = await this.LikeModel.findOne({ parentId });

    if (!like) {
      throw new NotFoundException();
    }

    return like;
  }
}
