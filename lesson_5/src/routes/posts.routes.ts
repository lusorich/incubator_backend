import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";

import { checkSchema, validationResult } from "express-validator";
import { ErrorsMessages, Post, PostWithId } from "../types";
import { getFiltersFromQuery, getFormattedErrors } from "../helpers";
import { ParsedQs } from "qs";

import { postsSchema } from "../schemas/posts.schema";

import { blogsQueryRepository } from "../repositories/blogs.query.repository";
import { postsQueryRepository } from "../repositories/posts.query.repository";
import { postsService } from "../domain/posts.service";

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
    async (req: Request<Post>, res: Response<Post | ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const newPost = await postsService.addPost(req.body);

      return res.status(HTTP_STATUS.CREATED).json(newPost);
    }
  )
  .delete(async (_req, res: Response) => {
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
  .delete(async (req: Request, res: Response) => {
    const found = await postsQueryRepository.getPostById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await postsService.deletePostById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
