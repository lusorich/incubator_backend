import { Injectable } from '@nestjs/common';
import { UsersCommandsRepository } from '../repositories/users.repository.commands';
import { UsersQueryRepository } from '../repositories/users.repository.query';

@Injectable()
export class UsersService {
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async create(login: string, email: string, emailConfirmation) {
    const result = await this.usersCommandsRepository.create(
      login,
      email,
      emailConfirmation,
    );

    return result.id;
  }

  async delete(id: number) {
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
}
