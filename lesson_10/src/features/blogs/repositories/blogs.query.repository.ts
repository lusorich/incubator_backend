import { Collection, ObjectId, WithId } from "mongodb";
import {
  ERROR_MSG,
  MONGO_COLLECTIONS,
  MONGO_DB_NAME,
  SortDirection,
} from "../../../constants";
import { client } from "../../../db/db";
import { PostWithId, QueryParams } from "../../../types";
import { postsQueryRepository } from "../../../repositories/query/posts.query.repository";
import { ResultObject } from "../../../common/helpers/result.helper";
import { COMMON_RESULT_STATUSES } from "../../../common/types/common.types";
import { BlogModel, BlogWithId } from "../domain/blog.entity";

export class BlogsQueryRepository extends ResultObject {
  model: typeof BlogModel;

  constructor() {
    super();
    this.model = BlogModel;
  }

  async getAllBlogs({
    pagination,
    sortBy,
    sortDirection,
    searchNameTerm = null,
  }: QueryParams) {
    const { pageSize = 10, pageNumber = 1 } = pagination;

    const allBlogsWithoutSorting = await this.model.find();
    const allBlogsCount = allBlogsWithoutSorting.length;

    const allBlogs = await this.model
      .find({
        name: {
          $regex: searchNameTerm || /./,
          $options: "i",
        },
      })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .sort({ [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 });

    let allBlogsToView: (BlogWithId | null)[] = [];

    if (allBlogs.length > 0) {
      allBlogsToView = allBlogs.map(this._mapToBlogViewModel);
    }

    if (searchNameTerm) {
      return this.getResult({
        data: {
          pagesCount: Math.ceil(allBlogs.length / pageSize),
          totalCount: allBlogs.length,
          pageSize,
          page: pageNumber,
          items: allBlogsToView,
        },
        status: COMMON_RESULT_STATUSES.SUCCESS,
      });
    }

    return this.getResult({
      data: {
        pagesCount: Math.ceil(allBlogsCount / pageSize),
        totalCount: allBlogsCount,
        pageSize,
        page: pageNumber,
        items: allBlogsToView,
      },
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  async getBlogPosts({
    pagination,
    sortBy,
    sortDirection,
    blogId,
  }: QueryParams & { blogId: PostWithId["blogId"] }) {
    const postsByBlogId = await postsQueryRepository.getAllPosts({
      pagination,
      sortBy,
      sortDirection,
      blogId,
    });

    return postsByBlogId;
  }

  async getBlogById(id: BlogWithId["id"]) {
    const found = await this.model.findOne({ _id: id });

    if (!found) {
      return this.getResult<null>({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
        errorMessage: ERROR_MSG[COMMON_RESULT_STATUSES.NOT_FOUND],
      });
    }

    return this.getResult<BlogWithId>({
      data: this._mapToBlogViewModel(found) as BlogWithId,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  _mapToBlogViewModel(blog: WithId<BlogWithId> | null): BlogWithId | null {
    if (!blog) {
      return null;
    }

    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
    };
  }
}

export const blogsQueryRepository = new BlogsQueryRepository();
