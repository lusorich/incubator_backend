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
