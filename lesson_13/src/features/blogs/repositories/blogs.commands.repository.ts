import { WithId } from 'mongodb';
import { ERROR_MSG } from '../../../constants';

import { ResultObject } from '../../../common/helpers/result.helper';
import {
  COMMON_RESULT_STATUSES,
  Result,
} from '../../../common/types/common.types';
import { BlogInput, BlogModel, BlogWithId } from '../domain/blog.entity';
import { blogsQueryRepository } from './blogs.query.repository';

export interface IBblogsCommandsRepository {
  addBlog: (newBlob: BlogWithId) => Promise<Result<BlogWithId>>;
  updateBlogById: (
    id: BlogWithId['id'],
    props: Partial<BlogInput>,
  ) => Promise<Result<null>>;
  deleteBlogById: (id: BlogWithId['id']) => Promise<Result<null>>;
  clearBlogs: () => Promise<this>;
}

export class BlogsCommandsRepository
  extends ResultObject
  implements IBblogsCommandsRepository
{
  model: typeof BlogModel;

  constructor() {
    super();
    this.model = BlogModel;
  }

  async addBlog(newBlog: BlogWithId) {
    const result = await this.model.create(newBlog);

    return this.getResult<BlogWithId>({
      status: COMMON_RESULT_STATUSES.SUCCESS,
      data: blogsQueryRepository._mapToBlogViewModel(
        result as WithId<BlogWithId>,
      ) as BlogWithId,
    });
  }

  async updateBlogById(id: BlogWithId['id'], props: Partial<BlogInput>) {
    const found = await this.model.updateOne(
      { _id: id },
      { $set: { ...props } },
    );

    if (!found.matchedCount) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
        errorMessage: ERROR_MSG[2],
      });
    }

    return this.getResult({
      data: null,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  async deleteBlogById(id: BlogWithId['id']) {
    const found = await this.model.deleteOne({ _id: id });

    if (!found.deletedCount) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
        errorMessage: ERROR_MSG[2],
      });
    }

    return this.getResult({
      data: null,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  async clearBlogs() {
    await this.model.deleteMany({});

    return this;
  }
}

export const blogsCommandsRepository = new BlogsCommandsRepository();
