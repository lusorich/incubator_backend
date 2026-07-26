import { Injectable } from '@nestjs/common';
import { UsersCommandsRepository } from '../repositories/users.repository.commands';
import { UsersQueryRepository } from '../repositories/users.repository.query';
import {
  CreateUserInputDto,
  GetUsersQueryParams,
  UserViewDto,
} from '../models/users.dto';
import { DomainException } from 'src/common/exceptions/domain.exceptions';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';
import { PaginatedViewDto } from 'src/common/PaginationQuery.dto';

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

    return result;
  }

  async deleteAll() {
    return await this.usersCommandsRepository.deleteAll();
  }

  async updateUserIsConfirmed(user, isConfirmed) {
    return await this.usersCommandsRepository.updateUserIsConfirmed(
      user,
      isConfirmed,
    );
  }

  async updateUserEmailConfirmation(user, emailConfirmation) {
    return await this.usersCommandsRepository.updateUserEmailConfirmation(
      user,
      emailConfirmation,
    );
  }

  async getByProperty(property: string, value: string) {
    return await this.usersQueryRepository.getByProperty(property, value);
  }

  async updatePasswordRecovery(user, passwordRecovery) {
    return await this.usersCommandsRepository.updatePasswordRecovery(
      user,
      passwordRecovery,
    );
  }

  async updatePassword(user, newPassword) {
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

    const viewItems = items.map(UserViewDto.getUserView);

    return PaginatedViewDto.getPaginatedDataDto({
      totalCount,
      pageSize: paginationParams.pageSize,
      page: paginationParams.pageNumber,
      items: viewItems,
    });
  }

  async getById(id) {
    return await this.usersQueryRepository.getById(id);
  }
}
