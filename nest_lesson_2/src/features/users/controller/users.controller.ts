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
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.repository.query';
import { SORT_DIRECTION } from 'src/common/types';

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
  async createUser(@Body() inputModel: any) {
    const result = await this.usersService.create(
      inputModel.login,
      inputModel.email,
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
