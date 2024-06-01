import { ObjectId, WithId } from 'mongodb';

import {
  UserDb,
  UserEmailConfirmation,
  UserEmailRecoveryPassword,
} from '../../../types';
import { UserModel, UserViewWithId } from '../domain/user.entity';
import { usersQueryRepository } from './users.query.repository';

export interface IUsersCommandsRepository {
  addUser: (newUser: UserDb) => Promise<UserViewWithId | null>;
  deleteUserById: (id: UserDb['id']) => Promise<boolean>;
  clearUsers: () => Promise<this>;
}

export class UsersCommandsRepository {
  model: typeof UserModel;

  constructor() {
    this.model = UserModel;
  }

  async addUser(user: UserDb) {
    const result = await this.model.create(user);

    return usersQueryRepository._mapToUserViewModel(result as WithId<UserDb>);
  }

  async deleteUserById(id: UserDb['id']) {
    const found = await this.model.deleteOne({ _id: id });

    if (!found.deletedCount) {
      return false;
    }

    return true;
  }

  async clearUsers() {
    await this.model.deleteMany({});

    return this;
  }
}

export const usersCommandsRepository = new UsersCommandsRepository();
