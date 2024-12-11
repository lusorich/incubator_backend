import { Controller, Get, Param } from '@nestjs/common';
import { IsNotEmpty, Length } from 'class-validator';

class CreateLikeInputDto {
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}

@Controller('likes')
export class CommentsController {
  constructor() {}

  @Get(':id')
  async getLike(@Param('id') id: string) {}
}
