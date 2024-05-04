import { Collection, ObjectId, WithId } from "mongodb";
import {
  MONGO_COLLECTIONS,
  MONGO_DB_NAME,
  SortDirection,
} from "../../constants";
import { client } from "../../db/db";
import { QueryParams, UserDb, UserViewWithId } from "../../types";
import { usersCommandsRepository } from "../commands/users.commands.repository";

export class UsersQueryRepository {
  coll: Collection<UserDb>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.USERS);
  }

  async getAllUsers({
    pagination,
    sortBy,
    sortDirection,
    searchLoginTerm,
    searchEmailTerm,
  }: QueryParams) {
    const { pageSize = 10, pageNumber = 1 } = pagination;

    const allUsersWithoutSorting = await this.coll.find().toArray();
    const allUsersCount = allUsersWithoutSorting.length;

    const users = await this.coll
      .find({
        $or: [
          {
            login: {
              $regex: searchLoginTerm || /./,
              $options: "i",
            },
          },
          {
            email: {
              $regex: searchEmailTerm || /./,
              $options: "i",
            },
          },
        ],
      })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .sort({ [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 })
      .toArray();

    let usersToView: (UserViewWithId | null)[] = [];

    if (users.length > 0) {
      usersToView = users.map(this._mapToUserViewModel);
    }

    if (searchLoginTerm || searchEmailTerm) {
      return {
        pagesCount: Math.ceil(usersToView.length / pageSize),
        totalCount: usersToView.length,
        pageSize,
        page: pageNumber,
        items: usersToView,
      };
    }

    return {
      pagesCount: Math.ceil(allUsersCount / pageSize),
      totalCount: allUsersCount,
      pageSize,
      page: pageNumber,
      items: usersToView,
    };
  }

  async getUserById(id: UserViewWithId["id"]) {
    const found = await this.coll.findOne({ _id: new ObjectId(id) });

    if (!found) {
      return null;
    }

    return this._mapToUserViewModel(found);
  }

  async findUserByEmail(email: UserViewWithId["email"]) {
    const found = await this.coll.findOne({ email: email });

    if (!found) {
      return null;
    }

    return found;
  }

  async findUserByLogin(login: UserViewWithId["login"]) {
    const found = await this.coll.findOne({ login: login });

    if (!found) {
      return null;
    }

    return found;
  }

  async findUserByConfirmationCode(code: string) {
    const found = await this.coll.findOne({
      "emailConfirmation.confirmationCode": code,
    });

    if (!found) {
      return null;
    }

    return found;
  }

  async findUserByRecoveryCode(recoveryCode: string) {
    const found = await this.coll.findOne({
      "emailPasswordRecovery.recoveryCode": recoveryCode,
    });

    if (!found) {
      return null;
    }

    return found;
  }

  _mapToUserViewModel(user: WithId<UserDb> | null): UserViewWithId | null {
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export const usersQueryRepository = new UsersQueryRepository();
