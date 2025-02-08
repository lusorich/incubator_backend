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
  Request,
  Req,
} from '@nestjs/common';
import { SORT_DIRECTION } from 'src/common/types';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repositories/posts.repository.query';
import { BlogsQueryRepository } from 'src/features/blogs/repositories/blogs.repository.query';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { LIKE_STATUS } from 'src/common/enums';
import { LikesQueryRepository } from 'src/features/likes/repositories/likes.repository.query';
import { AuthGuardBasic } from 'src/common/auth.guard.basic';
import { Trim } from 'src/common/trim.decorator';
import { IsBlogExist } from 'src/common/IsBlogExist';
import { JwtAuthGuard } from 'src/modules/usersModule/auth/application/jwt.auth.guard';

class CreateCommentForPostDto {
  @IsNotEmpty()
  @Trim()
  @Length(20, 300)
  content: string;
}

class UpdateLikeStatusInputDto {
  @IsNotEmpty()
  @IsEnum(LIKE_STATUS)
  likeStatus: string;
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

  @IsNotEmpty()
  @IsBlogExist({ message: 'Blog doesnt exist' })
  blogId: string;
}

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly jwtService: JwtService,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  @Get()
  async getPosts(
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe(SORT_DIRECTION.DESC))
    sortDirection: string,
    @Query('pageNumber', new DefaultValuePipe(1)) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Req() req,
  ) {
    const bearer = req?.headers?.authorization?.replace('Bearer ', '');
    let user = null;

    try {
      const verified = this.jwtService.verify(bearer);

      user = verified;
    } catch (e) {}

    const result = await this.postsService.getPosts({
      paginationParams: {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      },
      user,
    });

    return result;
  }

  @UseGuards(AuthGuardBasic)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() inputModel: CreatePostInputDto) {
    const blog = await this.blogsQueryRepository.getById(inputModel.blogId);

    const result = await this.postsService.create({
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: inputModel.blogId,
      blogName: blog.name,
    });

    return this.postsQueryRepository.getById(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() inputModel: CreateCommentForPostDto,
    @Request() req,
  ) {
    const post = await this.postsQueryRepository.getById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const createdComment = await this.postsService.createCommentForPost({
      content: inputModel.content,
      postId,
      userId: req.user.userId,
      userLogin: req.user.login,
    });

    return createdComment;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('id') id: string,
    @Body() userInput: UpdateLikeStatusInputDto,
    @Req() req,
  ) {
    const post = await this.postsQueryRepository.getById(id);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    const like = await this.likesQueryRepository.getByParentId(id, req.user);

    if (like) {
      await this.postsService.updatePostLikeStatus({
        id,
        likeStatus: userInput.likeStatus,
        user: req.user,
      });
    } else {
      await this.postsService.createPostLikeStatus({
        id,
        user: req.user,
        likeStatus: userInput.likeStatus,
      });
    }

    await this.postsService.recalculateLikes({
      parentId: id,
    });
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id') id: string,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe(SORT_DIRECTION.DESC))
    sortDirection: string,
    @Query('pageNumber', new DefaultValuePipe(1)) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Req() req,
  ) {
    const post = await this.postsQueryRepository.getById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const bearer = req?.headers?.authorization?.replace('Bearer ', '');
    let user = null;

    try {
      const verified = this.jwtService.verify(bearer);

      user = verified;
    } catch (e) {}

    const result = await this.postsService.getPostComments({
      paginationParams: {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      },
      id,
      user,
    });

    return result;
  }

  @UseGuards(AuthGuardBasic)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') id: string,
    @Body() inputModel: CreatePostInputDto,
  ) {
    const post = await this.postsQueryRepository.getById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postsService.update({ newData: inputModel, id });
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Req() req) {
    const post = await this.postsQueryRepository.getById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const bearer = req.headers?.authorization?.replace?.('Bearer ', '');
    let user = null;

    try {
      const verified = this.jwtService.verify(bearer);

      user = verified;
    } catch (e) {}

    if (user) {
      const postLike = await this.likesQueryRepository.getByParentId(id, user);

      post.extendedLikesInfo.myStatus =
        postLike?.likeStatus || LIKE_STATUS.None;
    }

    return post;
  }

  @UseGuards(AuthGuardBasic)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    const post = await this.postsQueryRepository.getById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.postsService.delete(id);
  }
}
