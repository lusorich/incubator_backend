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
import { DomainException } from 'src/common/exceptions/domain.exceptions';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';
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

    const result = await this.usersService.getUsers({
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
  // done
  @UseGuards(AuthGuardBasic)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userInput: CreateUserInputDto) {
    const createUser: any = {
      ...userInput,
      emailConfirmation: undefined,
    };

    const result = await this.usersService.create(createUser);

    return this.usersService.getById(result);
  }
  // done
  @UseGuards(AuthGuardBasic)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    const result: any = await this.usersService.delete(id);

    if (result.deletedCount < 1) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }
  }
}
