import { type Response, type Request, Router } from 'express';
import { ENDPOINTS, HTTP_STATUS } from '../constants';

import { checkSchema, validationResult } from 'express-validator';
import { ErrorsMessages } from '../types';
import {
  getFiltersFromQuery,
  getFormattedErrors,
  isDataInResult,
} from '../helpers';

import {
  likeStatusValidator,
  postsAddCommentSchema,
  postsSchema,
} from '../schemas/posts.schema';

import { blogsQueryRepository } from '../features/blogs/repositories/blogs.query.repository';
import { postsQueryRepository } from '../features/posts/repositories/posts.query.repository';
import { postsService } from '../features/posts/application/posts.service';
import { checkAuth, checkJwtAuth } from '../common/middlewares/auth.middleware';
import { usersQueryRepository } from '../features/users/repositories/users.query.repository';
import { commentsService } from '../domain/services/comments.service';
import { commentsQueryRepository } from '../repositories/query/comments.query.repository';
import { COMMON_RESULT_STATUSES, Result } from '../common/types/common.types';
import { Post, PostWithId } from '../features/posts/domain/post.entity';
import { jwtService } from '../common/services/jwt.service';
import { likesService } from '../features/likes/application/likes.service';

export const postsRouter = Router({});

postsRouter
  .route(ENDPOINTS.POSTS)
  .get(async (req: Request, res: Response) => {
    const { pagination, sortDirection, sortBy } = getFiltersFromQuery(
      req.query,
    );

    const token = req.headers.authorization?.split(' ')[1];

    const id = jwtService.getIdFromToken(token || '');
    const isValid = jwtService.isValid(token || '');

    const allPosts = await postsQueryRepository.getAllPosts({
      pagination,
      sortDirection,
      sortBy,
      userId: isValid ? id : undefined,
    });

    res.status(HTTP_STATUS.SUCCESS).json(allPosts.data);
  })
  .post(
    checkAuth,
    checkSchema(
      {
        ...postsSchema,
        blogId: {
          ...postsSchema['blogId'],
          custom: {
            options: async (value: string) => {
              const parentBlog = await blogsQueryRepository.getBlogById(value);

              if (parentBlog) {
                return true;
              }

              throw new Error('BlogId incorrect');
            },
          },
        },
      },
      ['body'],
    ),
    async (req: Request, res: Response<Post | ErrorsMessages>) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const newPost = await postsService.addPost(req.body);

      if (newPost) {
        return res.status(HTTP_STATUS.CREATED).json(newPost);
      }

      return;
    },
  )
  .delete(checkAuth, async (_req, res: Response) => {
    await postsService.clearPosts();

    res.sendStatus(HTTP_STATUS.SUCCESS);
  });

postsRouter
  .route(ENDPOINTS.POSTS_ID)
  .get(async (req: Request, res: Response<PostWithId | void>) => {
    const { id } = req.params;

    const token = req.headers.authorization?.split(' ')[1];

    const userId = jwtService.getIdFromToken(token || '');
    const isValid = jwtService.isValid(token || '');

    const foundPost = await postsQueryRepository.getPostById(
      id,
      isValid ? userId : undefined,
    );

    if (!isDataInResult<PostWithId | null>(foundPost)) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(foundPost.data);
  })
  .put(
    checkAuth,
    checkSchema(
      {
        ...postsSchema,
        blogId: {
          ...postsSchema['blogId'],
          custom: {
            options: async (value: string) => {
              const parentBlog = await blogsQueryRepository.getBlogById(value);

              if (parentBlog) {
                return true;
              }

              throw new Error('BlogId incorrect');
            },
          },
        },
      },
      ['body'],
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
        req.body,
      );

      if (!isSuccess) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    },
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
    checkSchema(postsAddCommentSchema, ['body']),
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

      if (!isDataInResult<(typeof post)['data']>(post)) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      const comment = await commentsService.addComment({
        user,
        post: post.data,
        content: req.body.content,
      });

      return res.status(HTTP_STATUS.CREATED).json(comment);
    },
  )
  .get(async (req: Request, res: Response) => {
    const { pagination, sortDirection, sortBy } = getFiltersFromQuery(
      req.query,
    );
    const postId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];

    const id = jwtService.getIdFromToken(token || '');
    const isValid = jwtService.isValid(token || '');
    let comments;

    if (id && isValid) {
      try {
        const user = await usersQueryRepository.getUserById(id);

        if (!user || !user.id) {
          return res.sendStatus(HTTP_STATUS.NO_AUTH);
        }

        comments = await commentsQueryRepository.getCommentsByPostId({
          pagination,
          sortDirection,
          sortBy,
          postId,
          userId: user.id,
        });
      } catch (e) {
        comments = await commentsQueryRepository.getCommentsByPostId({
          pagination,
          sortDirection,
          sortBy,
          postId,
          userId: '',
        });
      }
    } else {
      comments = await commentsQueryRepository.getCommentsByPostId({
        pagination,
        sortDirection,
        sortBy,
        postId,
        userId: '',
      });
    }

    if (!comments?.items.length) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(comments);
  });

postsRouter.route(ENDPOINTS.POSTS_LIKE_STATUS).put(
  checkJwtAuth,

  checkSchema({ likeStatus: likeStatusValidator }, ['body']),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
      const formattedErrors = getFormattedErrors(errors);

      return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
    }

    const { userId } = req;
    const status = req.body.likeStatus;
    const postId = req.params.id;

    const user = await usersQueryRepository.getUserById(userId);

    const post = await postsQueryRepository.getPostById(postId);

    if (post.status === COMMON_RESULT_STATUSES.NOT_FOUND) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await likesService.updateLike({
      userId: userId || '',
      parentId: postId,
      status,
      login: user?.login,
    });

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  },
);
