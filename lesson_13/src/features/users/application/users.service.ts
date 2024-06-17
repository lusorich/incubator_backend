import {
  IUsersCommandsRepository,
  UsersCommandsRepository,
  usersCommandsRepository,
} from '../repositories/users.commands.repository';

import { cryptService } from '../../../common/services/crypt.service';
import { UserInput, UserModel, UserView } from '../domain/user.entity';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class UsersService {
  private usersCommandsRepository: UsersCommandsRepository;

  constructor(usersCommandsRepository: UsersCommandsRepository) {
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

  async deleteUserById(id: UserView['id']) {
    return await this.usersCommandsRepository.deleteUserById(id);
  }

  async clearUsers() {}
}
