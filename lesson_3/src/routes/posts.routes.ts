import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";

import { checkSchema, validationResult } from "express-validator";
import { Blog, ErrorsMessages, Post, PostWithId } from "../types";
import { getFormattedErrors } from "../helpers";

import { PostsRepository } from "../repositories/posts.repository";
import { postsSchema } from "../schemas/posts.schema";
import { blogsRepository, postsRepository } from "../db/db";

export const postsRouter = Router({});

postsRouter
  .route(ENDPOINTS.POSTS)
  .get(async (_req: Request, res: Response) => {
    const allBlogs = await postsRepository.getAllPosts();

    res.status(HTTP_STATUS.SUCCESS).json(allBlogs);
  })
  .post(
    checkSchema(
      {
        ...postsSchema,
        blogId: {
          ...postsSchema["blogId"],
          custom: {
            options: async (value: string) => {
              const parentBlog = await blogsRepository.getBlogById(value);

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

      const newPost = await postsRepository.addPost(req.body);

      return res.status(HTTP_STATUS.CREATED).json(newPost);
    }
  )
  .delete(async (_req, res: Response) => {
    await postsRepository.clearPosts();

    res.sendStatus(HTTP_STATUS.SUCCESS);
  });

postsRouter
  .route(ENDPOINTS.POSTS_ID)
  .get(async (req: Request, res: Response<PostWithId | void>) => {
    const { id } = req.params;
    const foundPost = await postsRepository.getPostById(id);

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
              const parentBlog = await blogsRepository.getBlogById(value);

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

      const isSuccess = await postsRepository.updatePostById(
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
    const found = await postsRepository.getPostById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await postsRepository.deletePostById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
