import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { LIKE_STATUS } from 'src/common/enums';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/modules/usersModule/auth/application/jwt.auth.guard';
import { LikesQueryRepository } from '../../likes/repositories/likes.repository.query';
import { SkipThrottle } from '@nestjs/throttler';

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

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':id')
  async getComment(@Param('id') id: string, @Req() req) {
    const bearer = req?.headers?.authorization?.replace('Bearer ', '');
    let user = null;

    try {
      const verified = this.jwtService.verify(bearer);

      user = verified;
    } catch (e) {}

    return await this.commentsService.getCommentWithCurrentUserLikeStatus({
      id,
      user: user ?? null,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param('id') id: string,
    @Body() userInput: UpdateCommentInputDto,
    @Req() req,
  ) {
    const comment = await this.commentsQueryRepository.getById(id);

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.commentatorInfo.userLogin !== req.user.login) {
      throw new ForbiddenException();
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
  async deleteComment(@Param('id') id: string, @Req() req) {
    const comment = await this.commentsQueryRepository.getById(id);

    if (comment.commentatorInfo.userLogin !== req.user.login) {
      throw new ForbiddenException();
    }

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentsService.deleteComment({ id });
  }
}
