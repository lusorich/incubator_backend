import {
  IUsersCommandsRepository,
  usersCommandsRepository,
} from '../repositories/users.commands.repository';

import { cryptService } from '../../../common/services/crypt.service';
import { UserInput, UserModel } from '../domain/user.entity';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class UsersService {
  usersCommandsRepository: IUsersCommandsRepository;

  constructor() {
    this.usersCommandsRepository = usersCommandsRepository;
  }

  async addUser(user: UserInput) {
    const salt = await cryptService.getSalt();
    const userHash = await cryptService.getHash({
      password: user.password || '',
      salt,
    });

    const newUser = UserModel.makeInstance({
      login: user.login,
      email: user.email,
      hash: userHash,
    });

    return await this.usersCommandsRepository.save(newUser);
  }

  async deleteUserById(id: UserViewWithId['id']) {
    return await this.usersCommandsRepository.deleteUserById(id);
  }

  async clearUsers() {}
}

export const usersService = new UsersService();
