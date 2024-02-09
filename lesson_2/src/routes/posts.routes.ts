import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";

import { checkSchema, validationResult } from "express-validator";
import { Blog, ErrorsMessages, Post, PostWithId } from "../types";
import { getFormattedErrors } from "../helpers";

import { PostsRepository } from "../repositories/posts.repository";
import { db } from "../db/db";
import { postsSchema } from "../schemas/posts.schema";

export const postsRouter = Router({});

const postsRepository = new PostsRepository(db);

postsRouter
  .route(ENDPOINTS.POSTS)
  .get((_req: Request, res: Response) => {
    res.status(HTTP_STATUS.SUCCESS).json(postsRepository.getAllPosts());
  })
  .post(
    checkSchema(postsSchema, ["body"]),
    (req: Request<Post>, res: Response<Post | ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const newPost = postsRepository.addPost(req.body);
      res.status(HTTP_STATUS.CREATED).send(newPost);
    }
  );

postsRouter
  .route(ENDPOINTS.POSTS_ID)
  .get((req: Request, res: Response<PostWithId | void>) => {
    const { id } = req.params;
    const foundPost = postsRepository.getPostById(id);

    if (!foundPost) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(foundPost);
  })
  .put(
    checkSchema(
      {
        title: { ...postsSchema["title"], optional: true },
        shortDescription: {
          ...postsSchema["shortDescription"],
          optional: true,
        },
        content: { ...postsSchema["content"], optional: true },
        blogId: { ...postsSchema["blogId"], optional: true },
      },
      ["body"]
    ),
    (req: Request, res: Response<ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const isSuccess = postsRepository.updatePostById(req.params.id, req.body);

      if (!isSuccess) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  )
  .delete((req: Request, res: Response) => {
    const found = postsRepository.getPostById(req.params.id);

    if (!found) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    postsRepository.deletePostById(req.params.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
