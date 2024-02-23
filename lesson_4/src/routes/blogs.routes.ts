import { type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { body, checkSchema, validationResult } from "express-validator";
import { Blog, BlogWithId, ErrorsMessages, SortDirection } from "../types";
import { getFormattedErrors } from "../helpers";
import { blogsSchema } from "../schemas/blogs.schema";
import { blogsService } from "../domain/blogs.service";
import { blogsQueryRepository } from "../repositories/blogs.query.repository";
import { ParsedQs } from "qs";

export const blogsRouter = Router({});

blogsRouter
  .route(ENDPOINTS.BLOGS)
  .get(async (req: Request, res: Response) => {
    const { pagination, sortDirection, sortBy, searchNameTerm } = getFilters(
      req.query
    );

    const allBlogs = await blogsQueryRepository.getAllBlogs({
      pagination,
      sortDirection,
      sortBy,
      searchNameTerm,
    });

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

      const newBlog = await blogsService.addBlog(req.body);

      return res.status(HTTP_STATUS.CREATED).json(newBlog || undefined);
    }
  )
  .delete(async (_req, res: Response) => {
    await blogsService.clearBlogs();

    res.sendStatus(HTTP_STATUS.SUCCESS);
  });

blogsRouter
  .route(ENDPOINTS.BLOGS_ID)
  .get(async (req: Request, res: Response<BlogWithId | void>) => {
    const { id } = req.params;
    const foundBlog = await blogsQueryRepository.getBlogById(id);

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

      const isSuccess = await blogsService.updateBlogById(
        req.params.id,
        req.body
      );

      if (!isSuccess) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  )
  //TODO: возможно нет смысла сначала искать, достаточно делать удаление и проверять было ли что то удалено
  .delete(async (req: Request, res: Response) => {
    const found = await blogsQueryRepository.getBlogById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await blogsService.deleteBlogById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

blogsRouter
  .route(ENDPOINTS.POSTS_BY_BLOG_ID)
  .get(async (req: Request, res: Response) => {
    const { pagination, sortBy, sortDirection } = getFilters(req.query);
    const blogId = req.params.id;

    const posts = await blogsQueryRepository.getBlogPosts({
      pagination,
      sortBy,
      sortDirection,
      blogId,
    });

    if (posts.items.length === 0) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(posts);
  });

const getFilters = (query: ParsedQs) => {
  const pagination = {
    pageNumber: +(query.pageNumber || 1),
    pageSize: +(query.pageSize || 10),
  };

  const sortDirection = (): SortDirection => {
    if (query.sortDirection === "asc") {
      return "asc";
    }

    return "desc";
  };

  const sortBy = String(query.sortBy) || "createdAt";
  const searchNameTerm = (query.searchNameTerm as string | undefined) || null;

  return { pagination, sortDirection: sortDirection(), sortBy, searchNameTerm };
};
