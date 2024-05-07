import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { blogsCommandsRepository } from "../features/blogs/repositories/blogs.commands.repository";
import { postsCommandsRepository } from "../features/posts/repositories/posts.commands.repository";
import { usersCommandsRepository } from "../repositories/commands/users.commands.repository";
import { commentsCommandsRepository } from "../repositories/commands/comments.commands.repository";
import { sessionsService } from "../domain/services/sessions.service";

export const testingRouter = Router({});

testingRouter
  .route(ENDPOINTS.TESTING)
  .delete((_req: Request, res: Response) => {
    blogsCommandsRepository.clearBlogs();
    postsCommandsRepository.clearPosts();
    usersCommandsRepository.clearUsers();
    commentsCommandsRepository.clearComments();
    sessionsService.clearSessions();

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
