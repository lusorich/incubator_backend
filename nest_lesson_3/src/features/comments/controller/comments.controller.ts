import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.repository.query';
import { IsNotEmpty, IsEnum, Length } from 'class-validator';
import { CommentsService } from '../application/comments.service';
import { JwtAuthGuard } from 'src/features/auth/application/jwt.auth.guard';
import { LIKE_STATUS } from 'src/common/enums';
import { LikesQueryRepository } from 'src/features/likes/repositories/likes.repository.query';
import { JwtStrategy } from 'src/features/auth/application/auth.jwt.strategy';
import { JwtService } from '@nestjs/jwt';

class UpdateCommentInputDto {
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}

class UpdateLikeStatusInputDto {
  @IsNotEmpty()
  @IsEnum(LIKE_STATUS)
  likeStatus: string;
}

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly JwtStrategy: JwtStrategy,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':id')
  async getComment(@Param('id') id: string, @Req() req) {
    const bearer = req.headers.authorization.replace('Bearer ', '');
    const decodeToken = this.jwtService.decode(bearer);

    return await this.commentsService.getCommentWithCurrentUserLikeStatus({
      id,
      user: req?.user ?? null,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param('id') id: string,
    @Body() userInput: UpdateCommentInputDto,
  ) {
    const comment = await this.commentsQueryRepository.getById(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentsService.updateComment({
      id,
      content: userInput.content,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('id') id: string,
    @Body() userInput: UpdateLikeStatusInputDto,
    @Req() req,
  ) {
    await this.commentsQueryRepository.getById(id);

    const like = await this.likesQueryRepository.getByParentId(id, req.user);

    if (like) {
      await this.commentsService.updateCommentLikeStatus({
        id,
        likeStatus: userInput.likeStatus,
        user: req.user,
      });
    } else {
      await this.commentsService.createCommentLikeStatus({
        id,
        user: req.user,
        likeStatus: userInput.likeStatus,
      });
    }

    await this.commentsService.recalculateLikes({
      parentId: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('id') id: string) {
    const comment = await this.commentsQueryRepository.getById(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentsService.deleteComment({ id });
  }
}
