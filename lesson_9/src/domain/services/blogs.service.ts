import { BlogInput, BlogWithId } from "../../types";
import {
  IBblogsCommandsRepository,
  blogsCommandsRepository,
} from "../../repositories/commands/blogs.commands.repository";

export class BlogsService {
  blogsCommandsRepository: IBblogsCommandsRepository;

  constructor() {
    this.blogsCommandsRepository = blogsCommandsRepository;
  }

  async addBlog(blog: BlogInput) {
    const newBlog: BlogWithId = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
      id: String(Math.round(Math.random() * 1000)),
    };

    return await this.blogsCommandsRepository.addBlog(newBlog);
  }

  async updateBlogById(id: BlogWithId["id"], props: Partial<BlogInput>) {
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
