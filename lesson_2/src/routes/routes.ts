import type { Express, Request, Response, NextFunction } from "express";

import { blogsRouter } from "./blogs.routes";
import { postsRouter } from "./posts.routes";
import { testingRouter } from "./testing.routes";
import { HTTP_STATUS } from "../constants";

export default (app: Express) => {
  app.use(postsRouter);
  app.use(blogsRouter);
  app.use(testingRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      !req.originalUrl.includes("testing") &&
      req.method !== "GET" &&
      (!req.headers.authorization ||
        req.headers.authorization !== "YWRtaW4gcXdlcnR5")
    ) {
      return res.sendStatus(HTTP_STATUS.NO_AUTH);
    }

    return next();
  });
};
