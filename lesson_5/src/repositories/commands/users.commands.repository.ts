import { Collection, ObjectId, WithId } from "mongodb";
import { BlogWithId, Post, PostWithId, UserWithId } from "../../types";
import { client } from "../../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { postsQueryRepository } from "../query/posts.query.repository";
import { usersQueryRepository } from "../query/users.query.repository";

export interface IUsersCommandsRepository {
  addUser: (newUser: UserWithId) => Promise<UserWithId | null>;
  deleteUserById: (id: UserWithId["id"]) => Promise<boolean>;
  clearUsers: () => Promise<this>;
}

export class UsersCommandsRepository {
  coll: Collection<UserWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.USERS);
  }

  async addUser(user: UserWithId) {
    await this.coll.insertOne(user);

    return usersQueryRepository._mapToUserViewModel(user as WithId<UserWithId>);
  }

  async deleteUserById(id: UserWithId["id"]) {
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
}

export const usersCommandsRepository = new UsersCommandsRepository();
