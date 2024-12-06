import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.repository.query';
import { IsNotEmpty, Length } from 'class-validator';
import { CommentsService } from '../application/comments.service';
import { JwtAuthGuard } from 'src/features/auth/application/jwt.auth.guard';

class UpdateCommentInputDto {
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
  ) {}

  @Get(':id')
  async getComment(@Param('id') id: string) {
    return await this.commentsQueryRepository.getById(id);
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
