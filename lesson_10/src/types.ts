import { SortDirection } from "./constants";
import { BlogWithId } from "./features/blogs/domain/blog.entity";
import { PostWithId } from "./features/posts/domain/post.entity";
import { UserView, UserViewWithId } from "./features/users/domain/user.entity";

export interface UserDb extends UserViewWithId {
  hash: string;
  emailConfirmation?: UserEmailConfirmation;
  emailRecoveryPassword?: UserEmailRecoveryPassword;
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

export interface SecurityInfo {
  userId: Session["userId"];
  sessions: Session[];
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
