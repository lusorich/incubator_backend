import { Collection, ObjectId, WithId } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME, SortDirection } from "../constants";
import { client } from "../db/db";
import { BlogWithId, PostWithId, QueryParams } from "../types";
import { postsQueryRepository } from "./posts.query.repository";

export class BlogsQueryRepository {
  coll: Collection<BlogWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.BLOGS);
  }

  async getAllBlogs({
    pagination = {},
    sortBy = "createdAt",
    sortDirection,
    searchNameTerm = null,
  }: QueryParams) {
    const { pageSize = 10, pageNumber = 1 } = pagination;

    const allBlogsWithoutSorting = await this.coll.find().toArray();
    const allBlogsCount = allBlogsWithoutSorting.length;

    const allBlogs = await this.coll
      .find({
        name: {
          $regex: searchNameTerm || /./,
          $options: "i",
        },
      })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .sort({ [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 })
      .toArray();

    let allBlogsToView: (BlogWithId | null)[] = [];

    if (allBlogs.length > 0) {
      allBlogsToView = allBlogs.map(this._mapToBlogViewModel);
    }

    if (searchNameTerm) {
      return {
        pagesCount: Math.ceil(allBlogs.length / pageSize),
        totalCount: allBlogs.length,
        pageSize,
        page: pageNumber,
        items: allBlogsToView,
      };
    }

    return {
      pagesCount: Math.ceil(allBlogsCount / pageSize),
      totalCount: allBlogsCount,
      pageSize,
      page: pageNumber,
      items: allBlogsToView,
    };
  }

  async getBlogPosts({
    pagination = {},
    sortBy = "createdAt",
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
    const found = await this.coll.findOne({ _id: new ObjectId(id) });

    if (!found) {
      return null;
    }

    return this._mapToBlogViewModel(found);
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
