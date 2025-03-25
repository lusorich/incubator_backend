import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.repository.query';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { AuthGuardBasic } from 'src/common/auth.guard.basic';
import { Trim } from 'src/common/trim.decorator';
import {
  BaseSortablePaginationParams,
  PaginatedViewDto,
} from 'src/common/PaginationQuery.dto';
import { CreateUserInput, UserViewDto } from '../models/users.dto';
import { DomainException } from 'src/common/exceptions/domain.exceptions';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';

enum USERS_SORT_BY {
  'createdAt' = 'createdAt',
  'login' = 'login',
  'email' = 'email',
}

class GetUsersQueryParams extends BaseSortablePaginationParams<USERS_SORT_BY> {
  sortBy = USERS_SORT_BY.createdAt;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
}

//TODO: Move to users.dto.ts
class CreateUserInputDto implements CreateUserInput {
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Trim()
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

  @UseGuards(AuthGuardBasic)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userInput: CreateUserInputDto) {
    const createUser: CreateUserInput = {
      ...userInput,
      emailConfirmation: undefined,
    };

    const result = await this.usersService.create(createUser);

    return this.usersQueryRepository.getById(result);
  }

  @UseGuards(AuthGuardBasic)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.delete(id);

    if (result.deletedCount < 1) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }
  }
}
