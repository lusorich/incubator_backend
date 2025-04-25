import * as mongoose from 'mongoose';
import { Model, model } from 'mongoose';

export enum LIKE_STATUS {
  NONE = 'None',
  LIKE = 'Like',
  DISLIKE = 'Dislike',
}

export interface LikeInput {
  likeStatus: LIKE_STATUS;
}

export interface LikeDb {
  parentId: string;
  userId: string;
  status: LIKE_STATUS;
  addedAt?: Date;
}

export type LikeModelT = Model<LikeDb>;

const likeSchema = new mongoose.Schema<LikeDb>({
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: true,
  },
  addedAt: { type: Date },
});

export const LikeModel = model<LikeDb, LikeModelT>('Like', likeSchema);
export type LikeDocument = mongoose.HydratedDocument<LikeDb>;
