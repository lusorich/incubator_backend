import { Collection } from "mongodb";
import { Blog, BlogWithId } from "../types";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { client } from "../db/db";
import {
  IBblogsCommandsRepository,
  blogsCommandsRepository,
} from "../repositories/blogs.commands.repository";

export class BlogsService {
  coll: Collection<BlogWithId>;
  blogsCommandsRepository: IBblogsCommandsRepository;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.BLOGS);
    this.blogsCommandsRepository = blogsCommandsRepository;
  }

  async addBlog(blog: Blog) {
    const newBlog: BlogWithId = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
      id: String(Math.round(Math.random() * 1000)),
    };

    return await this.blogsCommandsRepository.addBlog(newBlog);
  }

  async updateBlogById(id: BlogWithId["id"], props: Partial<Blog>) {
    return await this.blogsCommandsRepository.updateBlogById(id, props);
  }

  async deleteBlogById(id: BlogWithId["id"]) {
    return await this.blogsCommandsRepository.deleteBlogById(id);
  }

  async clearBlogs() {
    await this.blogsCommandsRepository.clearBlogs();

    return this;
  }
}

export const blogsService = new BlogsService();
