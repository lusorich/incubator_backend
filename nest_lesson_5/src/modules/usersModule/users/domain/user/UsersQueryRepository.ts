import { GetUsersQueryParams } from '../../models/users.dto';

interface User {
  login: string;
  email: string;
  id: string;
  password: string;
  created_at: Date;
  email_confirmation_code: string | null;
  email_confirmation_expire: Date | null;
  email_confirmation_is_confirmed: boolean;
  password_recovery_code: string | null;
  password_recovery_is_used: boolean;
  password_recovery_expire: Date | null;
}

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
  abstract getById(id: string): any;
  abstract getByProperty(property, value: string): any;
}
