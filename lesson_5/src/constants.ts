export const SETTINGS = {
  PORT: "3003",
} as const;

export const enum ENDPOINTS {
  BLOGS = "/blogs",
  POSTS = "/posts",
  BLOGS_ID = "/blogs/:id",
  POSTS_BY_BLOG_ID = "/blogs/:id/posts",
  POSTS_ID = "/posts/:id",
  TESTING = "/testing/all-data",
  USERS = "/users",
  USERS_ID = "/users/:id",
  LOGIN = "/login",
}

export const enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  INCORRECT = 400,
  NO_CONTENT = 204,
  NO_AUTH = 401,
}

export const MONGO_DB_NAME = "kamasutra";

export const enum MONGO_COLLECTIONS {
  BLOGS = "blogs",
  POSTS = "posts",
  USERS = "users",
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}
