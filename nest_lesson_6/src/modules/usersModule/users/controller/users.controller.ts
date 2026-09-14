import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { AuthGuardBasic } from 'src/common/auth.guard.basic';
import { PaginatedViewDto } from 'src/common/PaginationQuery.dto';
import {
  CreateUserInputDto,
  GetUsersQueryParams,
  UserViewDto,
} from '../models/users.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('/sa/users')
export class UsersController {
  usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @UseGuards(AuthGuardBasic)
  @Get()
  async getUsers(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const {
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      searchEmailTerm,
      searchLoginTerm,
    } = query;

    return await this.usersService.getUsers({
      paginationParams: {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        searchEmailTerm,
        searchLoginTerm,
      },
    });
  }

  @UseGuards(AuthGuardBasic)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() userInput: CreateUserInputDto,
  ): Promise<UserViewDto> {
    const userId = await this.usersService.create(userInput);

    return await this.usersService.getById(userId);
  }

  @UseGuards(AuthGuardBasic)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
