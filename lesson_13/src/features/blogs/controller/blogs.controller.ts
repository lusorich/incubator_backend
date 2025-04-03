import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../../../constants';
import {
  getFiltersFromQuery,
  getFormattedErrors,
  isDataInResult,
} from '../../../helpers';
import { BlogsCommandsRepository } from '../repositories/blogs.commands.repository';
import { BlogsQueryRepository } from '../repositories/blogs.query.repository';
import { injectable } from 'inversify';
import { BlogsService } from '../application/blogs.service';
import { COMMON_RESULT_STATUSES } from '../../../common/types/common.types';

@injectable()
export class BlogsController {
  private blogsQueryRepository: BlogsQueryRepository;
  private blogsService: BlogsService;

  constructor(
    blogsQueryRepository: BlogsQueryRepository,
    blogsService: BlogsService,
  ) {
    this.blogsQueryRepository = blogsQueryRepository;
    this.blogsService = blogsService;
  }

  async getBlogs(req: Request, res: Response) {
    const { pagination, sortDirection, sortBy, searchNameTerm } =
      getFiltersFromQuery(req.query);

    const allBlogs = await this.blogsQueryRepository.getAllBlogs({
      pagination,
      sortDirection,
      sortBy,
      searchNameTerm,
    });

    res.status(HTTP_STATUS.SUCCESS).json(allBlogs.data);
  }

  async getBlogById(req, res) {
    const { id } = req.params;

    const result = await this.blogsQueryRepository.getBlogById(id);

    if (!isDataInResult(result)) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).json(result.data);
  }

  async addBlog(req, res) {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
      const formattedErrors = getFormattedErrors(errors);

      return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
    }

    const newBlog = await this.blogsService.addBlog(req.body);

    return res.status(HTTP_STATUS.CREATED).json(newBlog.data);
  }

  async updateBlogById(req, res) {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
      const formattedErrors = getFormattedErrors(errors);

      return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
    }

    const updateResult = await this.blogsService.updateBlogById(
      req.params.id,
      req.body,
    );

    if (updateResult.status === COMMON_RESULT_STATUSES.NOT_FOUND) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  }

  async deleteBlogById(req, res) {
    const result = await this.blogsService.deleteBlogById(req.params.id);

    if (result.status === COMMON_RESULT_STATUSES.NOT_FOUND) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  }
}
