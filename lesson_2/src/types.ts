export interface Blog {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogWithId extends Blog {
  id: string;
}

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface PostWithId extends Post {
  id: string;
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
