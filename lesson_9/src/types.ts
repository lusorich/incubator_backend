import { SortDirection } from "./constants";

export interface BlogInput {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface UserDb extends UserViewWithId {
  hash: string;
  emailConfirmation?: UserEmailConfirmation;
}

export interface UserViewWithId extends UserView {
  id: string;
}
export interface UserView {
  login: string;
  email: string;
  createdAt: Date;
}

export interface UserEmailConfirmation {
  confirmationCode: string | null;
  expire: Date | null;
  isConfirmed: boolean;
}

export interface CommentatorInfo {
  userId: string;
  userLogin: string;
}
export interface CommentView {
  content: string;
  id: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
}

export interface CommentDb extends CommentView {
  postId: PostWithId["id"];
}

export type UserAuthView = Omit<UserView, "createdAt"> & { userId: string };

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

export type BlogView = {
  pagesCount: number;
  totalCount: number;
  pageSize: number;
  page: number;
  items: (BlogWithId | null)[];
};

export type PostView = {
  pagesCount: number;
  totalCount: number;
  pageSize: number;
  page: number;
  items: (PostWithId | null)[];
};

export interface Blacklist {
  userId: string;
  tokens: string[]
}

export interface SecurityDevices {
  userId: string;
  deviceId: string;
  iat: Date;
  deviceName: string;
  ip: string;
  exp: Date;
}

export interface SecurityDeviceView {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
}