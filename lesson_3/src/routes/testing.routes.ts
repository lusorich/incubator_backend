import { type Express, type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { blogsRepository, postsRepository } from "../db/db";

export const testingRouter = Router({});

testingRouter
  .route(ENDPOINTS.TESTING)
  .delete((_req: Request, res: Response) => {
    blogsRepository.clearBlogs();
    postsRepository.clearPosts();

    res.send(HTTP_STATUS.NO_CONTENT);
  });
