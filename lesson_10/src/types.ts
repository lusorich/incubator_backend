import { SortDirection } from "./constants";
import { BlogWithId } from "./features/blogs/domain/blog.entity";

export interface UserDb extends UserViewWithId {
  hash: string;
  emailConfirmation?: UserEmailConfirmation;
  emailRecoveryPassword?: UserEmailRecoveryPassword;
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

export interface UserEmailRecoveryPassword {
  recoveryCode: string | null;
  expire: Date | null;
  isUsed: boolean;
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

export type PostView = {
  pagesCount: number;
  totalCount: number;
  pageSize: number;
  page: number;
  items: (PostWithId | null)[];
};

export interface SecurityInfo {
  userId: Session["userId"];
  sessions: Session[];
}

export interface RateRequest {
  ip: string;
  url: string;
  date: Date | string;
}

export interface Session {
  userId: string;
  deviceId: string;
  iat: Date | number | string;
  deviceName: string;
  ip: string;
  exp: Date | number | string;
}

export interface SessionView {
  ip: string;
  title: string;
  lastActiveDate: Session["iat"];
  deviceId: string;
}
