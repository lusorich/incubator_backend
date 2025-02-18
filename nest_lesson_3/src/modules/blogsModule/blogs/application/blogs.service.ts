import { Injectable } from '@nestjs/common';
import { BlogsCommandsRepository } from '../repositories/blogs.repository.commands';
import { PostsQueryRepository } from 'src/features/posts/repositories/posts.repository.query';
import { LikesService } from 'src/features/likes/application/likes.service';

@Injectable()
export class BlogsService {
  constructor(
    private blogsCommandsRepository: BlogsCommandsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private likesService: LikesService,
  ) {}

  async create({ description, websiteUrl, name }) {
    const result = await this.blogsCommandsRepository.create({
      name,
      description,
      websiteUrl,
    });

    return result.id;
  }

  async update({ newData, id }) {
    await this.blogsCommandsRepository.update({ newData, id });
  }

  async delete(id) {
    const result = await this.blogsCommandsRepository.delete(id);

    return result;
  }

  async deleteAll() {
    return await this.blogsCommandsRepository.deleteAll();
  }

  async getBlogPosts({ paginationParams, user, blogId }) {
    const posts = await this.postsQueryRepository.getPostsByBlog({
      paginationParams,
      blogId,
    });

    if (user) {
      await Promise.all(
        posts.items.map(async (post) => {
          const userLikeForPost =
            await this.likesService.getLikesByUserAndParentId({
              user,
              parentId: post.id,
            });

          if (userLikeForPost) {
            post.extendedLikesInfo.myStatus = userLikeForPost.likeStatus;
          }
        }),
      );
    }

    return posts;
  }
}
