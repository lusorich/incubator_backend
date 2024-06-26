import { Router, type Request, type Response } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { commentsQueryRepository } from "../repositories/query/comments.query.repository";
import { checkJwtAuth } from "../common/middlewares/auth.middleware";
import { checkSchema, validationResult } from "express-validator";
import {
  likeStatusValidator,
  postCommentContentValidator,
} from "../schemas/posts.schema";
import { getFormattedErrors } from "../helpers";
import { usersQueryRepository } from "../features/users/repositories/users.query.repository";
import { commentsService } from "../domain/services/comments.service";
import { jwtService } from "../common/services/jwt.service";
import { likesService } from "../features/likes/application/likes.service";
import { LikesQueryRepository } from "../features/likes/repositories/likes.query.repository";

export const commentsRouter = Router({});

commentsRouter
  .route(ENDPOINTS.COMMENTS_ID)
  .get(async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const token = req.headers.authorization?.split(" ")[1];

    const id = jwtService.getIdFromToken(token || "");
    const isValid = jwtService.isValid(token || "");
    let like;

    if (id && isValid) {
      try {
        const user = await usersQueryRepository.getUserById(id);

        if (!user || !user.id) {
          return res.sendStatus(HTTP_STATUS.NO_AUTH);
        }

        req.userId = user.id;

        like = await new LikesQueryRepository().getLikesByParentAndUserId(
          commentId,
          isValid ? user.id : ""
        );
      } catch (e) {
        like = await new LikesQueryRepository().getLikesByParentAndUserId(
          commentId,
          ""
        );
      }
    }

    const comment = await commentsQueryRepository.getCommentById(
      commentId,
      like
    );

    if (!comment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(comment);
  })
  .put(
    checkJwtAuth,
    checkSchema({ content: postCommentContentValidator }, ["body"]),
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
    }
  )
  .delete(checkJwtAuth, async (req: Request, res: Response) => {
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

commentsRouter
  .route(ENDPOINTS.COMMENTS_LIKE_STATUS)
  .put(
    checkJwtAuth,
    checkSchema({ likeStatus: likeStatusValidator }, ["body"]),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const { userId } = req;

      const parentId = req.params.id;
      const status = req.body.likeStatus;

      const comment = await commentsQueryRepository.getCommentById(parentId);

      if (!comment) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      await likesService.updateLike({
        userId: userId || "",
        parentId,
        status,
      });

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  );
