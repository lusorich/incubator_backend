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
import { BlogsQueryRepository } from '../repositories/blogs.repository.query';
import { BlogsService } from '../application/blogs.service';
import { PostsQueryRepository } from 'src/features/posts/repositories/posts.repository.query';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe(SORT_DIRECTION.DESC))
    sortDirection: string,
    @Query('pageNumber', new DefaultValuePipe(1)) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
  ) {
    const result = await this.blogsQueryRepository.getBlogs({
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
  async createBlog(@Body() inputModel: any) {
    const result = await this.blogsService.create({
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
    });

    return this.blogsQueryRepository.getById(result);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() inputModel: any) {
    const blog = await this.blogsQueryRepository.getById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogsService.update({ newData: inputModel, id });
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.getById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: number) {
    const result = await this.blogsService.delete(id);

    if (result.deletedCount < 1) {
      throw new NotFoundException('Blog not found');
    }
  }

  @Get(':id/posts')
  async getPostsByBlog(
    @Param('id') id: string,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe(SORT_DIRECTION.DESC))
    sortDirection: string,
    @Query('pageNumber', new DefaultValuePipe(1)) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
  ) {
    const blog = await this.blogsQueryRepository.getById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const result = await this.postsQueryRepository.getPostsByBlog({
      paginationParams: {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      },
      blogId: id,
    });

    return result;
  }
}
