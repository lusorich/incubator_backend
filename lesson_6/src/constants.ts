import * as dotenv from "dotenv";

dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL || "",
  DB_NAME: process.env.DB_NAME || "",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "",
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
  AUTH_LOGIN = "/auth/login",
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

export const REGEXP = {
  EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  LOGIN: /^[a-zA-Z0-9_-]*$/,
  URL: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};
