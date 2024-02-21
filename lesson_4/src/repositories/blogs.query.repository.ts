import { Collection, ObjectId, WithId } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { client } from "../db/db";
import { BlogWithId, GetAllBlogsQueryParams } from "../types";

export class BlogsQueryRepository {
  coll: Collection<BlogWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.BLOGS);
  }

  async getAllBlogs({ pagination = {} }: GetAllBlogsQueryParams) {
    const { pageSize = 1, pageNumber = 10 } = pagination;

    const allBlogs = await this.coll
      .find()
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();

    if (allBlogs.length > 0) {
      return allBlogs.map(this._mapToBlogViewModel);
    }

    return allBlogs;
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
