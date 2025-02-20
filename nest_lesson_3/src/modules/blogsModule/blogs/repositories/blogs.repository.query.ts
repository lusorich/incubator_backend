import { Injectable, NotFoundException } from '@nestjs/common';
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
    searchNameTerm = null,
  }: {
    paginationParams?: PaginationParams;
    searchNameTerm?: string;
  }) {
    const { sortBy, sortDirection, pageNumber, pageSize } = paginationParams;

    const blogs = await this.BlogModel.find({});

    const filteredBlogs = (
      await this.BlogModel.find({
        name: {
          $regex: searchNameTerm || /./,
          $options: 'i',
        },
      })
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .sort({ [sortBy]: sortDirection === SORT_DIRECTION.ASC ? 1 : -1 })
    ).map(blogOutputModelMapper);

    if (searchNameTerm) {
      return {
        pagesCount: Math.ceil(filteredBlogs.length / pageSize),
        totalCount: filteredBlogs.length,
        pageSize: Number(pageSize),
        page: Number(pageNumber),
        items: filteredBlogs,
      };
    }

    return {
      pagesCount: Math.ceil(blogs.length / pageSize),
      totalCount: blogs.length,
      pageSize: Number(pageSize),
      page: Number(pageNumber),
      items: filteredBlogs,
    };
  }

  async getById(id: string) {
    try {
      const blog = await this.BlogModel.findById(id);

      return blogOutputModelMapper(blog);
    } catch (e) {
      return null;
    }
  }
}
