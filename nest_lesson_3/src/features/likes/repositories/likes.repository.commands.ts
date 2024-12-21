import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, LikeModelType } from '../domain/like.entity';

@Injectable()
export class LikesCommandsRepository {
  constructor(@InjectModel(Like.name) private LikeModel: LikeModelType) {}

  async createLike({ parentId, user, likeStatus }) {
    const like = this.LikeModel.createLike({ parentId, user, likeStatus });

    return this.save(like);
  }

  async updateLike({ parentId, likeStatus, user }) {
    return this.LikeModel.updateOne(
      { $and: [{ parentId }, { 'user.login': user.login }] },
      {
        $set: { likeStatus },
      },
    );
  }

  async deleteLike({ id }) {
    return this.LikeModel.deleteOne({ _id: id });
  }

  save(like: LikeDocument) {
    return like.save();
  }

  async deleteAll() {
    return this.LikeModel.deleteMany({});
  }
}
