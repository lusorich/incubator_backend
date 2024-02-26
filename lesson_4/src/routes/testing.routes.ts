import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { blogsCommandsRepository } from "../repositories/blogs.commands.repository";
import { postsCommandsRepository } from "../repositories/posts.commands.repository";

export const testingRouter = Router({});

testingRouter
  .route(ENDPOINTS.TESTING)
  .delete((_req: Request, res: Response) => {
    blogsCommandsRepository.clearBlogs();
    postsCommandsRepository.clearPosts();

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
