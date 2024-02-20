import { type Express, type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { blogsCommandsRepository } from "../repositories/blogs.commands.repository";
import { postsRepository } from "../repositories/posts.repository";

export const testingRouter = Router({});

testingRouter
  .route(ENDPOINTS.TESTING)
  .delete((_req: Request, res: Response) => {
    blogsCommandsRepository.clearBlogs();
    postsRepository.clearPosts();

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
