import { SortDirection } from "./constants";

export interface BlogInput {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface UserDb extends UserViewWithId {
  hash: string;
}

export interface UserViewWithId extends UserView {
  id: string;
}
export interface UserView {
  login: string;
  email: string;
  createdAt: Date;
}

export interface BlogWithId extends BlogInput {
  id: string;
  createdAt: Date;
  isMembership: boolean;
}

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface PostWithId extends Post {
  id: string;
  createdAt: Date;
  blogName: string;
}

export interface Database {
  blogs: BlogWithId[];
  posts: PostWithId[];
}

export type FieldError = {
  message: string;
  field: string;
};

export type ErrorsMessages = {
  errorsMessages: FieldError[];
};

export type Pagination = {
  pageNumber: number;
  pageSize: number;
};

export interface QueryParams {
  pagination: Pagination;
  sortDirection: SortDirection;
  sortBy: string | keyof BlogWithId | keyof PostWithId;
  searchNameTerm?: string | null;
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
}
