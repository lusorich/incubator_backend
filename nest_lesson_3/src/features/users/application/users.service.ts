import { Injectable } from '@nestjs/common';
import { UsersCommandsRepository } from '../repositories/users.repository.commands';
import { UsersQueryRepository } from '../repositories/users.repository.query';

@Injectable()
export class UsersService {
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async create(
    login: string,
    email: string,
    password: string,
    emailConfirmation,
  ) {
    const result = await this.usersCommandsRepository.create(
      login,
      email,
      password,
      emailConfirmation,
    );

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

  async updatePasswordRecovery(user) {
    return await this.usersCommandsRepository.updatePasswordRecovery(user);
  }

  async updatePassword(user, newPassword) {
    return await this.usersCommandsRepository.updatePassword(user, newPassword);
  }
}
