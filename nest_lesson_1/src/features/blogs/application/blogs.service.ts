import { Injectable } from '@nestjs/common';
import { BlogsCommandsRepository } from '../repositories/blogs.repository.commands';

@Injectable()
export class BlogsService {
  constructor(private blogsCommandsRepository: BlogsCommandsRepository) {}

  async create({ description, websiteUrl, name }) {
    const result = await this.blogsCommandsRepository.create({
      name,
      description,
      websiteUrl,
    });

    return result.id;
  }

  async delete(id: number) {
    const result = await this.blogsCommandsRepository.delete(id);

    return result;
  }
}
