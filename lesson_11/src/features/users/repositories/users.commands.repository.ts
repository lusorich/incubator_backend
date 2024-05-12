import { ObjectId, WithId } from "mongodb";

import {
  UserDb,
  UserEmailConfirmation,
  UserEmailRecoveryPassword,
} from "../../../types";
import { UserModel, UserViewWithId } from "../domain/user.entity";
import { usersQueryRepository } from "./users.query.repository";

export interface IUsersCommandsRepository {
  addUser: (newUser: UserDb) => Promise<UserViewWithId | null>;
  deleteUserById: (id: UserDb["id"]) => Promise<boolean>;
  clearUsers: () => Promise<this>;
  updateUserPassword: (id: ObjectId, hash: string) => Promise<boolean>;
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

  async deleteUserById(id: UserDb["id"]) {
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

  //TODO: Maybe in service
  async setUserIsConfirmed(id: ObjectId) {
    let found = await this.model.updateOne(
      { _id: id },
      {
        $set: {
          emailConfirmation: {
            isConfirmed: true,
            confirmationCode: null,
            expire: null,
          },
        },
      }
    );

    if (!found.matchedCount) {
      return false;
    }

    return true;
  }

  async updateEmailConfirmation(
    id: ObjectId,
    emailConfirmation: UserEmailConfirmation
  ) {
    let found = await this.model.updateOne(
      { _id: id },
      {
        $set: {
          emailConfirmation,
        },
      }
    );

    if (!found.matchedCount) {
      return false;
    }

    return true;
  }

  async updateEmailRecoveryPasswordConfirmation(
    id: ObjectId,
    recoveryInfo: UserEmailRecoveryPassword
  ) {
    let found = await this.model.updateOne(
      { _id: id },
      {
        $set: {
          emailPasswordRecovery: recoveryInfo,
        },
      }
    );

    if (!found.matchedCount) {
      return false;
    }

    return true;
  }

  async updateUserPassword(id: ObjectId, hash: string) {
    let found = await this.model.updateOne(
      { _id: id },
      {
        $set: {
          hash,
        },
      }
    );

    if (!found.matchedCount) {
      return false;
    }

    return true;
  }
}

export const usersCommandsRepository = new UsersCommandsRepository();
