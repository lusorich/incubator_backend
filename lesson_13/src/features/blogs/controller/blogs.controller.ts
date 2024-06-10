import { HTTP_STATUS } from '../../../constants';
import { getFiltersFromQuery, isDataInResult } from '../../../helpers';
import { BlogsQueryRepository } from '../repositories/blogs.query.repository';
import { injectable } from 'inversify';

@injectable()
export class BlogsController {
  private blogsQueryRepository: BlogsQueryRepository;

  constructor(blogsQueryRepository: BlogsQueryRepository) {
    this.blogsQueryRepository = blogsQueryRepository;
  }

  async getBlogs(req, res) {
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
}
