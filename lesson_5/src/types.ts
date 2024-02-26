export interface Blog {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogWithId extends Blog {
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
  pageNumber?: number;
  pageSize?: number;
};

export type SortDirection = "asc" | "desc";

export interface QueryParams {
  pagination?: Pagination;
  sortDirection?: SortDirection;
  sortBy?: string | keyof BlogWithId | keyof PostWithId;
  searchNameTerm?: string | null;
}
