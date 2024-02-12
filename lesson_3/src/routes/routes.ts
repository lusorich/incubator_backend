import type { Express } from "express";

import { blogsRouter } from "./blogs.routes";
import { postsRouter } from "./posts.routes";
import { testingRouter } from "./testing.routes";

export default (app: Express) => {
  app.use(postsRouter);
  app.use(blogsRouter);
  app.use(testingRouter);
};
