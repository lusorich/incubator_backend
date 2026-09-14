import {
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  HttpStatus,
  Query,
  HttpCode,
  Body,
  Param,
  NotFoundException,
  Delete,
  Put,
} from '@nestjs/common';
import { SORT_DIRECTION } from 'src/common/types';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repositories/posts.repository.query';
import { BlogsQueryRepository } from 'src/features/blogs/repositories/blogs.repository.query';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getPosts(
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe(SORT_DIRECTION.DESC))
    sortDirection: string,
    @Query('pageNumber', new DefaultValuePipe(1)) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
  ) {
    const result = await this.postsQueryRepository.getPosts({
      paginationParams: {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      },
    });

    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() inputModel: any) {
    console.log(inputModel);
    const blog = await this.blogsQueryRepository.getById(inputModel.blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const result = await this.postsService.create({
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: inputModel.blogId,
      blogName: blog.name,
    });

    return this.postsQueryRepository.getById(result);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() inputModel: any) {
    const post = await this.postsQueryRepository.getById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postsService.update({ newData: inputModel, id });
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postsQueryRepository.getById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: number) {
    const result = await this.postsService.delete(id);

    if (result.deletedCount < 1) {
      throw new NotFoundException('Post not found');
    }
  }
}
