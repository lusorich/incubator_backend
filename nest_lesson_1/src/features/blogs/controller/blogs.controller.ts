import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { SORT_DIRECTION } from 'src/common/types';
import { BlogsQueryRepository } from '../repositories/blogs.repository.query';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  @Get()
  async getUsers(
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
}
