import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams, SORT_DIRECTION } from 'src/common/types';
import { Post } from '../domain/post.entity';
import { postOutputModelMapper } from '../models/posts.output.model';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<Post>) {}

  async getPosts({
    paginationParams = {},
  }: {
    paginationParams?: PaginationParams;
  }) {
    const { sortBy, sortDirection, pageNumber, pageSize } = paginationParams;

    const posts = await this.PostModel.find({});

    const filteredBlogs = (
      await this.PostModel.find({})
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .sort({ [sortBy]: sortDirection === SORT_DIRECTION.ASC ? 1 : -1 })
    ).map(postOutputModelMapper);

    return {
      pagesCount: Math.ceil(posts.length / pageSize),
      totalCount: posts.length,
      pageSize: Number(pageSize),
      page: Number(pageNumber),
      items: filteredBlogs,
    };
  }

  async getById(id: string) {
    const post = await this.PostModel.findById(id);

    return postOutputModelMapper(post);
  }

  async getPostsByBlog({
    blogId,
    paginationParams,
  }: {
    blogId: string;
    paginationParams?: PaginationParams;
  }) {
    const { sortBy, sortDirection, pageNumber, pageSize } = paginationParams;

    const posts = await this.PostModel.find({ blogId });

    const filteredPosts = (
      await this.PostModel.find({ blogId })
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .sort({ [sortBy]: sortDirection === SORT_DIRECTION.ASC ? 1 : -1 })
    ).map(postOutputModelMapper);

    return {
      pagesCount: Math.ceil(posts.length / pageSize),
      totalCount: posts.length,
      pageSize: Number(pageSize),
      page: Number(pageNumber),
      items: filteredPosts,
    };
  }
}
