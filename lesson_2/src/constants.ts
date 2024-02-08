export const SETTINGS = {
  PORT: "3003",
} as const;

export const enum ENDPOINTS {
  BLOGS = "/blogs",
  POSTS = "/posts",
  BLOGS_ID = "/blogs/:id",
  POSTS_ID = "/posts/:id",
  TESTING = "/testing/all-data",
}

export const enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  INCORRECT = 400,
  NO_CONTENT = 204,
}
