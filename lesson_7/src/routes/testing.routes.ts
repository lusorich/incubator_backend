import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { blogsCommandsRepository } from "../repositories/commands/blogs.commands.repository";
import { postsCommandsRepository } from "../repositories/commands/posts.commands.repository";
import { usersCommandsRepository } from "../repositories/commands/users.commands.repository";
import { commentsCommandsRepository } from "../repositories/commands/comments.commands.repository";

export const testingRouter = Router({});

testingRouter
  .route(ENDPOINTS.TESTING)
  .delete((_req: Request, res: Response) => {
    blogsCommandsRepository.clearBlogs();
    postsCommandsRepository.clearPosts();
    usersCommandsRepository.clearUsers();
    commentsCommandsRepository.clearComments();

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
