import { Collection, ObjectId, WithId } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { client } from "../db/db";
import { Blog, BlogWithId } from "../types";

export class BlogsRepository {
  coll: Collection<BlogWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.BLOGS);
  }

  async addBlog(blog: Blog) {
    const newBlog: BlogWithId = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
      id: String(Math.round(Math.random() * 1000)),
    };

    await this.coll.insertOne(newBlog);

    return this.map(newBlog as WithId<BlogWithId>);
  }

  async getAllBlogs() {
    const allBlogs = await this.coll.find().toArray();

    if (allBlogs.length > 0) {
      return allBlogs.map(this.map);
    }

    return allBlogs;
  }

  async getBlogById(id: BlogWithId["id"]) {
    const found = await this.coll.findOne({ _id: new ObjectId(id) });

    if (!found) {
      return null;
    }

    return this.map(found);
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

  map(blog: WithId<BlogWithId>): BlogWithId {
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
