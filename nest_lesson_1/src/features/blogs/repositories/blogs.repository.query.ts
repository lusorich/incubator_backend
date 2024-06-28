import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams, SORT_DIRECTION } from 'src/common/types';
import { Blog } from '../domain/blog.entity';
import { blogOutputModelMapper } from '../models/blogs.output.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<Blog>) {}

  async getBlogs({
    paginationParams = {},
  }: {
    paginationParams?: PaginationParams;
  }) {
    const { sortBy, sortDirection, pageNumber, pageSize } = paginationParams;

    const blogs = await this.BlogModel.find({});

    const filteredBlogs = (
      await this.BlogModel.find({})
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .sort({ [sortBy]: sortDirection === SORT_DIRECTION.ASC ? 1 : -1 })
    ).map(blogOutputModelMapper);

    return {
      pagesCount: Math.ceil(blogs.length / pageSize),
      totalCount: blogs.length,
      pageSize,
      page: pageNumber,
      items: filteredBlogs,
    };
  }

  async getById(id: string) {
    const blog = await this.BlogModel.findById(id);

    return blog;
  }
}
