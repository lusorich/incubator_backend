import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { Model } from 'mongoose';
import { userOutputModelMapper } from '../models/users.output.model';
import { PaginationParams, SORT_DIRECTION } from 'src/common/types';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async getUsers({
    paginationParams = {},
  }: {
    paginationParams?: PaginationParams;
  }) {
    const {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
    } = paginationParams;

    const users = await this.UserModel.find({});

    const filteredUsers = (
      await this.UserModel.find({
        $or: [
          { login: { $regex: searchLoginTerm || /./, $options: 'i' } },
          { email: { $regex: searchEmailTerm || /./, $options: 'i' } },
        ],
      })
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .sort({ [sortBy]: sortDirection === SORT_DIRECTION.ASC ? 1 : -1 })
    ).map(userOutputModelMapper);

    if (searchLoginTerm || searchEmailTerm) {
      return {
        pagesCount: Math.ceil(filteredUsers.length / pageSize),

        totalCount: filteredUsers.length,
        pageSize: Number(pageSize),
        page: Number(pageNumber),
        items: filteredUsers,
      };
    } else {
      return {
        pagesCount: Math.ceil(users.length / pageSize),
        totalCount: users.length,
        pageSize: Number(pageSize),
        page: Number(pageNumber),
        items: filteredUsers,
      };
    }
  }

  async getById(id: string) {
    const user = await this.UserModel.findById(id);

    return userOutputModelMapper(user);
  }

  async getByProperty(property: string, value: string) {
    const user = await this.UserModel.findOne({ [property]: value });

    return user;
  }
}
