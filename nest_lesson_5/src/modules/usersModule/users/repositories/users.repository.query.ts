import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { Model } from 'mongoose';
import { PaginationParams, SORT_DIRECTION } from 'src/common/types';
import { UserViewDto } from '../models/users.dto';
import { PaginatedViewDto } from 'src/common/PaginationQuery.dto';
import { Database } from 'src/modules/databaseModule/database';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private database: Database,
  ) {}

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
    console.log(
      'db',
      await this.database.selectFrom('users').selectAll().execute(),
    );

    const filteredUsers = (
      await this.UserModel.find({
        $and: [
          { login: { $regex: searchLoginTerm || /./, $options: 'i' } },
          { email: { $regex: searchEmailTerm || /./, $options: 'i' } },
        ],
      })
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .sort({ [sortBy]: sortDirection === SORT_DIRECTION.ASC ? 1 : -1 })
    ).map(UserViewDto.getUserView);

    if (searchLoginTerm || searchEmailTerm) {
      return PaginatedViewDto.getPaginatedDataDto({
        totalCount: filteredUsers.length,
        pageSize: Number(pageSize),
        page: Number(pageNumber),
        items: filteredUsers,
      });
    } else {
      return PaginatedViewDto.getPaginatedDataDto({
        totalCount: users.length,
        pageSize: Number(pageSize),
        page: Number(pageNumber),
        items: filteredUsers,
      });
    }
  }

  async getById(id: string) {
    const user = await this.UserModel.findById(id);

    return UserViewDto.getUserView(user);
  }

  async getByProperty(property: string, value: string) {
    const user = await this.UserModel.findOne({ [property]: value });

    return user;
  }

  async getByProperties(properties: Record<string, string>[]) {
    const user = await this.UserModel.findOne({
      $or: properties,
    });

    return user;
  }
}
