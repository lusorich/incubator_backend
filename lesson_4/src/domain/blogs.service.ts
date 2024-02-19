import { Collection, ObjectId, WithId } from "mongodb";
import { Blog, BlogWithId } from "../types";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { client } from "../db/db";
import { blogsRepository } from "../repositories/blogs.repository";

export class BlogsService {
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

    return await blogsRepository.addBlog(newBlog);
  }

  async getAllBlogs() {
    const allBlogs = await this.coll.find().toArray();

    return allBlogs;
  }

  async getBlogById(id: BlogWithId["id"]) {
    const foundBlog = await blogsRepository.getBlogById(id);

    return foundBlog;
  }

  async updateBlogById(id: BlogWithId["id"], props: Partial<Blog>) {
    return await blogsRepository.updateBlogById(id, props);
  }

  async deleteBlogById(id: BlogWithId["id"]) {
    return await blogsRepository.deleteBlogById(id);
  }

  async clearBlogs() {
    await blogsRepository.clearBlogs();

    return this;
  }
}

export const blogsService = new BlogsService();
