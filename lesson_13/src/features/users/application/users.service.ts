import {
  IUsersCommandsRepository,
  usersCommandsRepository,
} from '../repositories/users.commands.repository';

import { cryptService } from '../../../common/services/crypt.service';
import { UserDb, UserInput, UserModel } from '../domain/user.entity';

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

    const userModel = UserModel.makeInstance({
      login: user.login,
      email: user.email,
      hash: userHash,
    });

    return await this.usersCommandsRepository.addUser(newUser);
  }

  async deleteUserById(id: UserViewWithId['id']) {
    return await this.usersCommandsRepository.deleteUserById(id);
  }

  async clearUsers() {}
}

export const usersService = new UsersService();
