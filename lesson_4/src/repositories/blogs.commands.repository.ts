import { Collection, ObjectId, WithId } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { client } from "../db/db";
import { Blog, BlogWithId } from "../types";
import { blogsQueryRepository } from "./blogs.query.repository";

export class BlogsCommandsRepository {
  coll: Collection<BlogWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.BLOGS);
  }

  async addBlog(newBlog: BlogWithId) {
    await this.coll.insertOne(newBlog);

    return blogsQueryRepository._mapToBlogViewModel(
      newBlog as WithId<BlogWithId>
    );
  }

  async updateBlogById(id: BlogWithId["id"], props: Partial<Blog>) {
    let found = await this.coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...props } }
    );

    if (!found.matchedCount) {
      return null;
    }

    return true;
  }

  async deleteBlogById(id: BlogWithId["id"]) {
    const found = await this.coll.deleteOne({ _id: new ObjectId(id) });

    if (!found.deletedCount) {
      return null;
    }

    return true;
  }

  async clearBlogs() {
    await this.coll.deleteMany({});

    return this;
  }
}

export const blogsCommandsRepository = new BlogsCommandsRepository();
