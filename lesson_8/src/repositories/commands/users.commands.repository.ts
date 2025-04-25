import { Collection, ObjectId, WithId } from "mongodb";

import { client } from "../../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { postsQueryRepository } from "../query/posts.query.repository";
import { usersQueryRepository } from "../query/users.query.repository";
import { UserDb, UserEmailConfirmation, UserViewWithId } from "../../types";

export interface IUsersCommandsRepository {
  addUser: (newUser: UserDb) => Promise<UserViewWithId | null>;
  deleteUserById: (id: UserDb["id"]) => Promise<boolean>;
  clearUsers: () => Promise<this>;
}

export class UsersCommandsRepository {
  coll: Collection<UserDb>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.USERS);
  }

  async addUser(user: UserDb) {
    await this.coll.insertOne(user);

    return usersQueryRepository._mapToUserViewModel(user as WithId<UserDb>);
  }

  async deleteUserById(id: UserDb["id"]) {
    const found = await this.coll.deleteOne({ _id: new ObjectId(id) });

    if (!found.deletedCount) {
      return false;
    }

    return true;
  }

  async clearUsers() {
    await this.coll.deleteMany({});

    return this;
  }

  //TODO: Maybe in service
  async setUserIsConfirmed(id: ObjectId) {
    let found = await this.coll.updateOne(
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
    let found = await this.coll.updateOne(
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
}

export const usersCommandsRepository = new UsersCommandsRepository();
