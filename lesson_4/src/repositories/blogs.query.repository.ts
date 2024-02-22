import { Collection, ObjectId, WithId } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { client } from "../db/db";
import { BlogWithId, GetAllBlogsQueryParams } from "../types";

export class BlogsQueryRepository {
  coll: Collection<BlogWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.BLOGS);
  }

  async getAllBlogs({
    pagination = {},
    sortBy = "createdAt",
    sortDirection = "desc",
    searchNameTerm = null,
  }: GetAllBlogsQueryParams) {
    const { pageSize = 10, pageNumber = 1 } = pagination;

    const allBlogsWithoutSorting = await this.coll.find().toArray();
    const allBlogsCount = allBlogsWithoutSorting.length - 1;

    const allBlogs = await this.coll
      .find({
        name: {
          $regex: searchNameTerm || /./,
          $options: "i",
        },
      })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .toArray();

    let allBlogsToView: (BlogWithId | null)[] = [];

    if (allBlogs.length > 0) {
      allBlogsToView = allBlogs.map(this._mapToBlogViewModel);
    }

    return {
      pagesCount: Math.round(allBlogsCount / pageSize),
      totalCount: allBlogsCount,
      pageSize,
      page: pageNumber,
      items: allBlogsToView,
    };
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
