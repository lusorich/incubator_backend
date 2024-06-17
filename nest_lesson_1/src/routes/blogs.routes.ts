import { type Response, type Request, Router } from 'express';
import { ENDPOINTS, HTTP_STATUS } from '../constants';
import { checkSchema, validationResult } from 'express-validator';
import { ErrorsMessages } from '../types';
import {
  getFiltersFromQuery,
  getFormattedErrors,
  isDataInResult,
} from '../helpers';
import { blogsSchema } from '../schemas/blogs.schema';
import { blogsService } from '../features/blogs/application/blogs.service';
import { blogsQueryRepository } from '../features/blogs/repositories/blogs.query.repository';
import { postsSchema } from '../schemas/posts.schema';
import { postsService } from '../features/posts/application/posts.service';
import { Post } from '../features/posts/domain/post.entity';
import { container } from '../common/helpers/inversify.container';
import { BlogsController } from '../features/blogs/controller/blogs.controller';

export const blogsRouter = Router({});

const blogsController = container.resolve(BlogsController);

blogsRouter
  .route(ENDPOINTS.BLOGS)
  .get(blogsController.getBlogs.bind(blogsController))
  .post(
    checkSchema(blogsSchema, ['body']),
    blogsController.addBlog.bind(blogsController),
  )
  .delete(async (_req, res: Response) => {
    await blogsService.clearBlogs();

    res.sendStatus(HTTP_STATUS.SUCCESS);
  });

blogsRouter
  .route(ENDPOINTS.BLOGS_ID)
  .get(blogsController.getBlogById.bind(blogsController))
  .put(
    checkSchema(blogsSchema, ['body']),
    blogsController.updateBlogById.bind(blogsController),
  )
  .delete(blogsController.deleteBlogById.bind(blogsController));

blogsRouter
  .route(ENDPOINTS.POSTS_BY_BLOG_ID)
  .get(async (req: Request, res: Response) => {
    const { pagination, sortBy, sortDirection } = getFiltersFromQuery(
      req.query,
    );
    const blogId = req.params.id;

    const postsResult = await blogsQueryRepository.getBlogPosts({
      pagination,
      sortBy,
      sortDirection,
      blogId,
    });

    if (
      postsResult?.data &&
      'items' in postsResult.data &&
      postsResult.data.items.length === 0
    ) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(postsResult.data);
  })
  .post(
    checkSchema(
      {
        content: postsSchema['content'],
        title: postsSchema['title'],
        shortDescription: postsSchema['shortDescription'],
      },
      ['body'],
    ),
    async (req: Request, res: Response<Post | ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const blogId = req.params.id;

      const blog = await blogsQueryRepository.getBlogById(blogId);

      if (!isDataInResult(blog)) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      const newPost = await postsService.addPost({ ...req.body, blogId });

      return res.status(HTTP_STATUS.CREATED).json(newPost || undefined);
    },
  );
