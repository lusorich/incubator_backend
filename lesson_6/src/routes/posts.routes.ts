import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";

import { checkSchema, validationResult } from "express-validator";
import { ErrorsMessages, Post, PostWithId } from "../types";
import { getFiltersFromQuery, getFormattedErrors } from "../helpers";

import { postsAddCommentSchema, postsSchema } from "../schemas/posts.schema";

import { blogsQueryRepository } from "../repositories/query/blogs.query.repository";
import { postsQueryRepository } from "../repositories/query/posts.query.repository";
import { postsService } from "../domain/services/posts.service";
import { checkAuth, checkJwtAuth } from "../auth.middleware";
import { usersQueryRepository } from "../repositories/query/users.query.repository";
import { commentsService } from "../domain/services/comments.service";
import { commentsQueryRepository } from "../repositories/query/comments.query.repository";

export const postsRouter = Router({});

postsRouter
  .route(ENDPOINTS.POSTS)
  .get(async (req: Request, res: Response) => {
    const { pagination, sortDirection, sortBy } = getFiltersFromQuery(
      req.query
    );

    const allPosts = await postsQueryRepository.getAllPosts({
      pagination,
      sortDirection,
      sortBy,
    });

    res.status(HTTP_STATUS.SUCCESS).json(allPosts);
  })
  .post(
    checkAuth,
    checkSchema(
      {
        ...postsSchema,
        blogId: {
          ...postsSchema["blogId"],
          custom: {
            options: async (value: string) => {
              const parentBlog = await blogsQueryRepository.getBlogById(value);

              if (parentBlog) {
                return true;
              }

              throw new Error("BlogId incorrect");
            },
          },
        },
      },
      ["body"]
    ),
    async (req: Request, res: Response<Post | ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const newPost = await postsService.addPost(req.body);

      return res.status(HTTP_STATUS.CREATED).json(newPost);
    }
  )
  .delete(checkAuth, async (_req, res: Response) => {
    await postsService.clearPosts();

    res.sendStatus(HTTP_STATUS.SUCCESS);
  });

postsRouter
  .route(ENDPOINTS.POSTS_ID)
  .get(async (req: Request, res: Response<PostWithId | void>) => {
    const { id } = req.params;
    const foundPost = await postsQueryRepository.getPostById(id);

    if (!foundPost) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(foundPost);
  })
  .put(
    checkAuth,
    checkSchema(
      {
        ...postsSchema,
        blogId: {
          ...postsSchema["blogId"],
          custom: {
            options: async (value: string) => {
              const parentBlog = await blogsQueryRepository.getBlogById(value);

              if (parentBlog) {
                return true;
              }

              throw new Error("BlogId incorrect");
            },
          },
        },
      },
      ["body"]
    ),
    async (req: Request, res: Response<ErrorsMessages>) => {
      const errors = validationResult(req).array({
        onlyFirstError: true,
      });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const isSuccess = await postsService.updatePostById(
        req.params.id,
        req.body
      );

      if (!isSuccess) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  )
  .delete(checkAuth, async (req: Request, res: Response) => {
    const found = await postsQueryRepository.getPostById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await postsService.deletePostById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

postsRouter
  .route(ENDPOINTS.POSTS_ID_COMMENTS)
  .post(
    checkJwtAuth,
    checkSchema(postsAddCommentSchema, ["body"]),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({
        onlyFirstError: true,
      });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const userIdFromRequest = req.userId;
      const postId = req.params.id;

      if (!userIdFromRequest) {
        return res.sendStatus(HTTP_STATUS.NO_AUTH);
      }

      const user = await usersQueryRepository.getUserById(userIdFromRequest);

      if (!user) {
        return res.sendStatus(HTTP_STATUS.NO_AUTH);
      }

      const post = await postsQueryRepository.getPostById(postId);

      if (!post) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      const comment = await commentsService.addComment({
        user,
        post,
        content: req.body.content,
      });

      return res.status(HTTP_STATUS.CREATED).json(comment);
    }
  )
  .get(async (req: Request, res: Response) => {
    const { pagination, sortDirection, sortBy } = getFiltersFromQuery(
      req.query
    );

    const postId = req.params.id;

    const comments = await commentsQueryRepository.getCommentsByPostId({
      pagination,
      sortDirection,
      sortBy,
      postId,
    });

    if (!comments.items.length) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(comments);
  });
