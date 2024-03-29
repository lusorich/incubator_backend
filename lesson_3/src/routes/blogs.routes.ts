import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { checkSchema, validationResult } from "express-validator";
import { Blog, BlogWithId, ErrorsMessages } from "../types";
import { getFormattedErrors } from "../helpers";
import { blogsSchema } from "../schemas/blogs.schema";
import { blogsRepository } from "../db/db";

export const blogsRouter = Router({});

blogsRouter
  .route(ENDPOINTS.BLOGS)
  .get(async (_req: Request, res: Response) => {
    const allBlogs = await blogsRepository.getAllBlogs();

    res.status(HTTP_STATUS.SUCCESS).json(allBlogs);
  })
  .post(
    checkSchema(blogsSchema, ["body"]),
    async (req: Request<Blog>, res: Response<Blog | ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const newBlog = await blogsRepository.addBlog(req.body);

      return res.status(HTTP_STATUS.CREATED).json(newBlog);
    }
  )
  .delete(async (_req, res: Response) => {
    await blogsRepository.clearBlogs();

    res.sendStatus(HTTP_STATUS.SUCCESS);
  });

blogsRouter
  .route(ENDPOINTS.BLOGS_ID)
  .get(async (req: Request, res: Response<BlogWithId | void>) => {
    const { id } = req.params;
    const foundBlog = await blogsRepository.getBlogById(id);

    if (!foundBlog) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(foundBlog);
  })
  .put(
    checkSchema(blogsSchema, ["body"]),
    async (req: Request, res: Response<ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const isSuccess = await blogsRepository.updateBlogById(
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
    const found = await blogsRepository.getBlogById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await blogsRepository.deleteBlogById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
