import * as mongoose from "mongoose";
import { Model, model } from "mongoose";

export interface BlogInput {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogWithId extends BlogInput {
  id?: string;
  createdAt: Date;
  isMembership: boolean;
}

type BlogModel = Model<BlogWithId>;

const blogSchema = new mongoose.Schema<BlogWithId>({
  createdAt: {
    type: Date,
  },
  isMembership: {
    type: Boolean,
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 15,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500,
  },
  websiteUrl: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
});

export const BlogModel = model<BlogWithId, BlogModel>("Blog", blogSchema);
export type BlogDocument = mongoose.HydratedDocument<BlogWithId>;

export type BlogView = {
  pagesCount: number;
  totalCount: number;
  pageSize: number;
  page: number;
  items: (BlogWithId | null)[];
};
