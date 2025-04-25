import { SortDirection } from './constants';
import { LIKE_STATUS } from './features/likes/domain/like.entity';
import { PostWithId } from './features/posts/domain/post.entity';

export interface CommentatorInfo {
  userId: string;
  userLogin: string;
}
export interface CommentLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LIKE_STATUS;
}
export interface CommentView {
  content: string;
  id: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: CommentLikesInfo;
  createdAt: Date;
}

export interface CommentDb extends CommentView {
  postId: PostWithId['id'];
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
  sortBy: string;
  searchNameTerm?: string | null;
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
}
