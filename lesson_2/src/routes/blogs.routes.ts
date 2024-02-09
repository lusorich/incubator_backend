import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { BlogsRepository } from "../repositories/blogs.repository";
import { checkSchema, validationResult } from "express-validator";
import { Blog, BlogWithId, ErrorsMessages } from "../types";
import { getFormattedErrors } from "../helpers";
import { blogsSchema } from "../schemas/blogs.schema";
import { db } from "../db/db";

export const blogsRouter = Router({});

const blogsRepository = new BlogsRepository(db);

blogsRouter
  .route(ENDPOINTS.BLOGS)
  .get((_req: Request, res: Response) => {
    res.status(HTTP_STATUS.SUCCESS).json(blogsRepository.getAllBlogs());
  })
  .post(
    checkSchema(blogsSchema, ["body"]),
    (req: Request<Blog>, res: Response<Blog | ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const newBlog = blogsRepository.addBlog(req.body);
      return res.status(HTTP_STATUS.CREATED).send(newBlog);
    }
  );

blogsRouter
  .route(ENDPOINTS.BLOGS_ID)
  .get((req: Request, res: Response<BlogWithId | void>) => {
    const { id } = req.params;
    const foundBlog = blogsRepository.getBlogById(id);

    if (!foundBlog) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(foundBlog);
  })
  .put(
    checkSchema(
      {
        name: { ...blogsSchema["name"], optional: true },
        description: { ...blogsSchema["description"], optional: true },
        websiteUrl: { ...blogsSchema["websiteUrl"], optional: true },
      },
      ["body"]
    ),
    (req: Request, res: Response<ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const isSuccess = blogsRepository.updateBlogById(req.params.id, req.body);

      if (!isSuccess) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  )
  .delete((req: Request, res: Response) => {
    const found = blogsRepository.getBlogById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    blogsRepository.deleteBlogById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
