import { Injectable } from '@nestjs/common';
import { UsersCommandsRepository } from '../repositories/users.repository.commands';

@Injectable()
export class UsersService {
  constructor(private usersCommandsRepository: UsersCommandsRepository) {}

  async create(login: string, email: string) {
    const result = await this.usersCommandsRepository.create(login, email);

    return result.id;
  }

  async delete(id: number) {
    const result = await this.usersCommandsRepository.delete(id);

    return result;
  }

  async deleteAll() {
    return await this.usersCommandsRepository.deleteAll();
  }
}
