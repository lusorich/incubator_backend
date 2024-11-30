import {
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  HttpStatus,
  Query,
  HttpCode,
  Body,
} from '@nestjs/common';
import { SORT_DIRECTION } from 'src/common/types';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

class CreateBlogInputDto {
  @IsNotEmpty()
  @Length(1, 15)
  name: string;

  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsNotEmpty()
  @Length(1, 100)
  @IsEmail()
  websiteUrl: string;
}

@Controller('comments')
export class CommentsController {
  constructor() {}

  @Get()
  async getComment(
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe(SORT_DIRECTION.DESC))
    sortDirection: string,
    @Query('pageNumber', new DefaultValuePipe(1)) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Query('searchNameTerm', new DefaultValuePipe(null)) searchNameTerm: string,
  ) {}
}
