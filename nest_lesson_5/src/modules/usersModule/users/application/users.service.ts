import { Injectable } from '@nestjs/common';
import {
  CreateUserInputDto,
  GetUsersQueryParams,
  getUserView,
} from '../models/users.dto';
import { DomainException } from 'src/common/exceptions/domain.exceptions';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';
import { PaginatedViewDto } from 'src/common/PaginationQuery.dto';
import { UsersQueryRepository } from '../domain/user/UsersQueryRepository';
import { User } from '../domain/user.entity';
import { EmailConfirmation } from '../domain/email-confirmation';
import { PasswordConfirmation } from '../domain/password-confirmation';
import { UsersCommandsRepository } from '../domain/user/UsersCommandsRepository';

@Injectable()
export class UsersService {
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async create(createUserInput: CreateUserInputDto) {
    const existedEmailUsers = await this.usersQueryRepository.getByProperty(
      'email',
      createUserInput.email,
    );

    const existedLoginUsers = await this.usersQueryRepository.getByProperty(
      'login',
      createUserInput.login,
    );

    if (existedEmailUsers) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        errorsMessages: [{ field: 'email', message: 'not correct' }],
      });
    }

    if (existedLoginUsers) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        errorsMessages: [{ field: 'login', message: 'not correct' }],
      });
    }

    const result = await this.usersCommandsRepository.create(createUserInput);

    return result.id;
  }

  async delete(id: string) {
    const result = await this.usersCommandsRepository.delete(id);

    if (!result) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    return result;
  }

  async deleteAll() {
    return await this.usersCommandsRepository.deleteAll();
  }

  async updateUserIsConfirmed(user: User, isConfirmed: boolean) {
    return await this.usersCommandsRepository.updateUserIsConfirmed(
      user,
      isConfirmed,
    );
  }

  async updateUserEmailConfirmation(
    user: User,
    emailConfirmation: EmailConfirmation,
  ) {
    return await this.usersCommandsRepository.updateUserEmailConfirmation(
      user,
      emailConfirmation,
    );
  }

  async getByProperty(property: string, value: string) {
    return await this.usersQueryRepository.getByProperty(property, value);
  }

  async updatePasswordRecovery(
    user: User,
    passwordRecovery: PasswordConfirmation,
  ) {
    return await this.usersCommandsRepository.updatePasswordRecovery(
      user,
      passwordRecovery,
    );
  }

  async updatePassword(user: User, newPassword: string) {
    return await this.usersCommandsRepository.updatePassword(user, newPassword);
  }

  async getUsers({
    paginationParams,
  }: {
    paginationParams: GetUsersQueryParams;
  }) {
    const { items, totalCount } = await this.usersQueryRepository.getUsers({
      paginationParams: {
        ...paginationParams,
        sortBy: !paginationParams.sortBy
          ? 'createdAt'
          : paginationParams.sortBy,
      },
    });

    const usersView = items.map((item) => getUserView(item));

    return PaginatedViewDto.getPaginatedDataDto({
      totalCount,
      pageSize: paginationParams.pageSize,
      page: paginationParams.pageNumber,
      items: usersView,
    });
  }

  async getById(id: string) {
    return getUserView(await this.usersQueryRepository.getById(id));
  }
}
