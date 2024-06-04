import { ObjectId, WithId } from 'mongodb';

import {
  UserDb,
  UserDocument,
  UserModel,
  UserView,
} from '../domain/user.entity';
import { usersQueryRepository } from './users.query.repository';

export interface IUsersCommandsRepository {
  save: (user: UserDocument) => Promise<UserView | null>;
  deleteUserById: (id: UserDb['id']) => Promise<boolean>;
  clearUsers: () => Promise<this>;
}

export class UsersCommandsRepository {
  model: typeof UserModel;

  constructor() {
    this.model = UserModel;
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

  async save(user: UserDocument) {
    const res = await user.save();

    return usersQueryRepository._mapToUserViewModel(res);
  }
}

export const usersCommandsRepository = new UsersCommandsRepository();
