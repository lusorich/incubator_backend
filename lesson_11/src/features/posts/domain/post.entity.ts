import mongoose, { Model, model } from "mongoose";

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface PostWithId extends Post {
  id?: string;
  createdAt: Date;
  blogName: string;
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
});

export const PostModel = model<PostWithId, PostModel>("Post", postSchema);
export type PostDocument = mongoose.HydratedDocument<PostWithId>;
