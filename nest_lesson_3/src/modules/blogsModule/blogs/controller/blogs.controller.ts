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
  UseGuards,
  Req,
} from '@nestjs/common';
import { SORT_DIRECTION } from 'src/common/types';
import { BlogsQueryRepository } from '../repositories/blogs.repository.query';
import { BlogsService } from '../application/blogs.service';
import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { AuthGuardBasic } from 'src/common/auth.guard.basic';
import { Trim } from 'src/common/trim.decorator';
import { JwtService } from '@nestjs/jwt';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/repositories/posts.repository.query';
import {
  BaseSortablePaginationParams,
  PaginatedViewDto,
} from 'src/common/PaginationQuery.dto';
import { BlogViewDto } from '../domain/blogs.dto';
import { Blog } from '../domain/blog.entity';

class CreateBlogInputDto {
  @IsNotEmpty()
  @Trim()
  @Length(1, 15)
  name: string;

  @IsNotEmpty()
  @Trim()
  @Length(1, 500)
  description: string;

  @IsNotEmpty()
  @Length(1, 100)
  @IsUrl()
  websiteUrl: string;
}

class CreatePostInputDto {
  @IsNotEmpty()
  @Trim()
  @Length(0, 30)
  title: string;

  @IsNotEmpty()
  @Trim()
  @Length(0, 100)
  shortDescription: string;

  @IsNotEmpty()
  @Trim()
  @Length(0, 1000)
  content: string;
}

class GetBlogsQueryParams extends BaseSortablePaginationParams<
  keyof BlogViewDto
> {
  sortBy = 'createdAt' as const;
  searchNameTerm: string | null;
}

class GetBlogsPostsParams {}

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async getBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const { sortBy, sortDirection, pageSize, pageNumber, searchNameTerm } =
      query;

    const result = await this.blogsQueryRepository.getBlogs({
      paginationParams: {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      },
      searchNameTerm,
    });

    return result;
  }

  @UseGuards(AuthGuardBasic)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() inputModel: CreateBlogInputDto) {
    const result = await this.blogsService.create({
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
    });

    return this.blogsQueryRepository.getById(result);
  }

  @UseGuards(AuthGuardBasic)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() inputModel: CreateBlogInputDto,
  ) {
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

  @Get(':id/posts')
  async getPostsByBlog(
    @Param('id') id: string,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe(SORT_DIRECTION.DESC))
    sortDirection: string,
    @Query('pageNumber', new DefaultValuePipe(1)) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Req() req,
  ) {
    const blog = await this.blogsQueryRepository.getById(id);
    const bearer = req?.headers?.authorization?.replace('Bearer ', '');
    let user = null;

    try {
      const verified = this.jwtService.verify(bearer);

      user = verified;
    } catch (e) {}

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const result = await this.blogsService.getBlogPosts({
      paginationParams: {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      },
      blogId: id,
      user,
    });

    return result;
  }

  @UseGuards(AuthGuardBasic)
  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlog(
    @Param('id') id: string,
    @Body() inputModel: CreatePostInputDto,
  ) {
    const { title, shortDescription, content } = inputModel;

    const blog = await this.blogsQueryRepository.getById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const post = await this.postsService.create({
      title,
      shortDescription,
      content,
      blogId: blog.id,
      blogName: blog.name,
    });

    return await this.postsQueryRepository.getById(post);
  }

  @UseGuards(AuthGuardBasic)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.getById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return await this.blogsService.delete(id);
  }
}
