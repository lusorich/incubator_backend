import type { Express } from "express";

import { blogsRoutes } from "./blogs.routes";
import { postsRoutes } from "./posts.routes";
import { testingRoutes } from "./testing.routes";

export default (app: Express) => {
  blogsRoutes(app);
  postsRoutes(app); // old
  app.use("/posts", postsRoutes);
  testingRoutes(app);
};
