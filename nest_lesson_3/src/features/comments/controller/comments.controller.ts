import { Controller, DefaultValuePipe, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.repository.query';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async getComment(@Param('id') id: string) {
    return await this.commentsQueryRepository.getById(id);
  }
}
