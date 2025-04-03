import { BlogInput, BlogWithId } from '../domain/blog.entity';
import { BlogsCommandsRepository } from '../repositories/blogs.commands.repository';
import { injectable } from 'inversify';

@injectable()
export class BlogsService {
  private blogsCommandsRepository: BlogsCommandsRepository;

  constructor(blogsCommandsRepository: BlogsCommandsRepository) {
    this.blogsCommandsRepository = blogsCommandsRepository;
  }

  async addBlog(blog: BlogInput) {
    const newBlog: BlogWithId = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
    };

    return await this.blogsCommandsRepository.addBlog(newBlog);
  }

  async updateBlogById(id: BlogWithId['id'], props: Partial<BlogInput>) {
    return await this.blogsCommandsRepository.updateBlogById(id, props);
  }

  async deleteBlogById(id: BlogWithId['id']) {
    return await this.blogsCommandsRepository.deleteBlogById(id);
  }

  async clearBlogs() {
    await this.blogsCommandsRepository.clearBlogs();

    return this;
  }
}
