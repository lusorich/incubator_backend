import { GetUsersQueryParams } from '../../models/users.dto';
import { User } from '../user.entity';

export class UserSummary {
  id: string;
  login: string;
  email: string;
  createdAt: Date;

  constructor({
    id,
    login,
    email,
    createdAt,
  }: {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
  }) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.createdAt = createdAt;
  }
}

export abstract class UsersQueryRepository {
  abstract getUsers({
    paginationParams,
  }: {
    paginationParams: GetUsersQueryParams;
  }): Promise<{ items: UserSummary[]; totalCount: number }>;
  abstract getById(id: string): Promise<UserSummary>;
  abstract getByProperty(property: string, value: string): Promise<User>;
}
