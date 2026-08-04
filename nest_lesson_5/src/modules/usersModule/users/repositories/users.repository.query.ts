import { Injectable } from '@nestjs/common';
import { SORT_DIRECTION } from 'src/common/types';
import {
  GetUsersQueryParams,
  getUserView,
  UserViewDto,
} from '../models/users.dto';
import { Database } from 'src/modules/databaseModule/database';
import { sql } from 'kysely';
import {
  UsersQueryRepository,
  UserSummary,
} from '../domain/user/UsersQueryRepository';

@Injectable()
export class KyselyUsersQueryRepository implements UsersQueryRepository {
  constructor(private database: Database) {}

  async getUsers({
    paginationParams,
  }: {
    paginationParams: GetUsersQueryParams;
  }) {
    const {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
    } = paginationParams;

    const users = await this.database.selectFrom('users').selectAll().execute();

    let query = this.database.selectFrom('users').selectAll();

    if (searchEmailTerm || searchLoginTerm) {
      query = query.where((eb) => {
        const filters = [];

        if (searchEmailTerm) {
          filters.push(eb('email', 'ilike', `%${searchEmailTerm}%`));
        }

        if (searchLoginTerm) {
          filters.push(eb('login', 'ilike', `%${searchLoginTerm}%`));
        }

        return eb.or(filters);
      });
    }

    if (sortBy === 'createdAt') {
      query = query.orderBy(
        'created_at',
        sortDirection === SORT_DIRECTION.ASC ? 'asc' : 'desc',
      );
    } else {
      query = query.orderBy(
        sql`${sql.raw(sortBy)} COLLATE "C"`,
        sortDirection === SORT_DIRECTION.ASC ? 'asc' : 'desc',
      );
    }

    let filteredUsers = await query
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .execute();

    return {
      items: filteredUsers.map(
        (user) =>
          new UserSummary({
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.created_at,
          }),
      ),
      totalCount:
        searchEmailTerm || searchLoginTerm
          ? filteredUsers.length
          : users.length,
    };
  }

  async getById(id: string) {
    const user = await this.database
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    //wrong
    return getUserView(user as any);
  }

  //ts
  async getByProperty(property: any, value: string) {
    const user = await this.database
      .selectFrom('users')
      .selectAll()
      .where(property, '=', value)
      .executeTakeFirst();

    return user as any;
  }
}
