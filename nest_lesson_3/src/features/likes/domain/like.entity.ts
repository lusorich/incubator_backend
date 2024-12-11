import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LIKE_STATUS } from 'src/common/enums';

@Schema()
export class LikeUser {
  @Prop()
  id: string;

  @Prop()
  login: string;
}

@Schema()
export class Like {
  @Prop()
  parentId: string;

  @Prop()
  status: LIKE_STATUS;

  @Prop()
  user: LikeUser;

  @Prop()
  createdAt: Date;

  static createLike({ user, parentId }) {
    const like = new this();

    like.parentId = parentId;
    like.user = user;
    like.status = LIKE_STATUS.None;
    like.createdAt = new Date();

    return like;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.loadClass(Like);

export type LikeDocument = HydratedDocument<Like>;

type LikeModelStaticType = {
  createLike: ({
    user,
    parentId,
  }: {
    user: LikeUser;
    parentId: string;
  }) => LikeDocument;
};

export type LikeModelType = Model<LikeDocument> & LikeModelStaticType;
