import { Collection } from "mongodb";
import { Blog, BlogWithId } from "../types";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { client } from "../db/db";
import { blogsCommandsRepository } from "../repositories/blogs.commands.repository";

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

    return await blogsCommandsRepository.addBlog(newBlog);
  }

  async updateBlogById(id: BlogWithId["id"], props: Partial<Blog>) {
    return await blogsCommandsRepository.updateBlogById(id, props);
  }

  async deleteBlogById(id: BlogWithId["id"]) {
    return await blogsCommandsRepository.deleteBlogById(id);
  }

  async clearBlogs() {
    await blogsCommandsRepository.clearBlogs();

    return this;
  }
}

export const blogsService = new BlogsService();
