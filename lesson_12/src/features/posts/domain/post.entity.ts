import mongoose, { Model, model } from 'mongoose';
import { LIKE_STATUS } from '../../likes/domain/like.entity';

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface PostLike {
  addedAt: Date;
  userId: string;
  login: string;
}

export interface PostLikes {
  likesCount: number;
  dislikesCount: number;
  myStatus: LIKE_STATUS;
  newestLikes: PostLike[];
}

export interface PostWithId extends Post {
  id?: string;
  createdAt: Date;
  blogName: string;
  extendedLikesInfo: PostLikes;
}

export type PostView = {
  pagesCount: number;
  totalCount: number;
  pageSize: number;
  page: number;
  items: (PostWithId | null)[];
};

type PostModel = Model<PostWithId>;

const postSchema = new mongoose.Schema<PostWithId>({
  createdAt: {
    type: Date,
  },
  blogId: {
    type: String,
  },
  blogName: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
  },
  shortDescription: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000,
  },
  extendedLikesInfo: {
    likesCount: { type: Number },
    dislikesCount: { type: Number },
    myStatus: { type: String },
    newestLikes: { type: Array },
  },
});

export const PostModel = model<PostWithId, PostModel>('Post', postSchema);
export type PostDocument = mongoose.HydratedDocument<PostWithId>;
