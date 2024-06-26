import { Router, type Request, type Response } from 'express';
import { ENDPOINTS, HTTP_STATUS } from '../constants';
import { commentsQueryRepository } from '../repositories/query/comments.query.repository';
import { checkSchema, validationResult } from 'express-validator';
import { postCommentContentValidator } from '../schemas/posts.schema';
import { getFormattedErrors } from '../helpers';
import { usersQueryRepository } from '../features/users/repositories/users.query.repository';
import { commentsService } from '../domain/services/comments.service';
import { LikesQueryRepository } from '../features/likes/repositories/likes.query.repository';

export const commentsRouter = Router({});

commentsRouter
  .route(ENDPOINTS.COMMENTS_ID)
  .get(async (req: Request, res: Response) => {
    const commentId = req.params.id;

    const like = await new LikesQueryRepository().getLikesByParentId(commentId);

    const comment = await commentsQueryRepository.getCommentById(
      commentId,
      like,
    );

    if (!comment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(comment);
  })
  .put(
    checkSchema({ content: postCommentContentValidator }, ['body']),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const commentId = req.params.id;

      const comment = await commentsQueryRepository.getCommentById(commentId);
      const user = await usersQueryRepository.getUserById(String(req.userId));

      if (!comment) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      if (user?.id !== comment?.commentatorInfo.userId) {
        return res.sendStatus(HTTP_STATUS.INCORRECT_OWNER);
      }

      await commentsService.updateCommentById(commentId, req.body.content);

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    },
  )
  .delete(async (req: Request, res: Response) => {
    const commentId = req.params.id;

    const comment = await commentsQueryRepository.getCommentById(commentId);
    const user = await usersQueryRepository.getUserById(String(req.userId));

    if (!comment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    if (user?.id !== comment?.commentatorInfo.userId) {
      return res.sendStatus(HTTP_STATUS.INCORRECT_OWNER);
    }

    await commentsService.deleteCommentById(commentId);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
