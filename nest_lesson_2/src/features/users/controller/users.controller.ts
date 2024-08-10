import {
  ArgumentMetadata,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  PipeTransform,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.repository.query';
import { SORT_DIRECTION } from 'src/common/types';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

class CreateUserInputDto {
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}

@Controller('users')
export class UsersController {
  usersService: UsersService;
  constructor(
    usersService: UsersService,

    private readonly usersQueryRepository: UsersQueryRepository,
  ) {
    this.usersService = usersService;
  }

  @Get()
  async getUsers(
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe(SORT_DIRECTION.DESC))
    sortDirection: string,
    @Query('pageNumber', new DefaultValuePipe(1)) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Query('searchEmailTerm') searchEmailTerm: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
  ) {
    const result = await this.usersQueryRepository.getUsers({
      paginationParams: {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        searchEmailTerm,
        searchLoginTerm,
      },
    });

    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userInput: CreateUserInputDto) {
    const result = await this.usersService.create(
      userInput.login,
      userInput.email,
    );

    return this.usersQueryRepository.getById(result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: number) {
    const result = await this.usersService.delete(id);

    if (result.deletedCount < 1) {
      throw new NotFoundException('User not found');
    }
  }
}
