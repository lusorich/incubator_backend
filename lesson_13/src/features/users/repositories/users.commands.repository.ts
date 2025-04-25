import { ObjectId, WithId } from 'mongodb';

import {
  UserDb,
  UserDocument,
  UserModel,
  UserView,
} from '../domain/user.entity';
import { usersQueryRepository } from './users.query.repository';
import { ResultObject } from '../../../common/helpers/result.helper';
import { COMMON_RESULT_STATUSES } from '../../../common/types/common.types';
import { ERROR_MSG, ErrorsMsg } from '../../../constants';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class UsersCommandsRepository extends ResultObject {
  model: typeof UserModel;

  constructor() {
    super();
    this.model = UserModel;
  }

  async deleteUserById(id: UserView['id']) {
    const found = await this.model.deleteOne({ _id: id });

    if (!found.deletedCount) {
      return this.getResult<boolean>({
        data: false,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
        errorMessage: ERROR_MSG[COMMON_RESULT_STATUSES.NOT_FOUND],
      });
    }

    return this.getResult<boolean>({
      data: true,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
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
