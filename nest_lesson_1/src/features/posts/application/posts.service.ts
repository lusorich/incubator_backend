import { Injectable } from '@nestjs/common';
import { PostsCommandsRepository } from '../repositories/posts.repository.commands';

@Injectable()
export class PostsService {
  constructor(private postsCommandsRepository: PostsCommandsRepository) {}

  async create({ title, shortDescription, content, blogId, blogName }) {
    const result = await this.postsCommandsRepository.create({
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    });

    return result.id;
  }

  async update({ newData, id }) {
    await this.postsCommandsRepository.update({ newData, id });
  }

  async delete(id: number) {
    const result = await this.postsCommandsRepository.delete(id);

    return result;
  }
}
