import { BaseSortablePaginationParams } from 'src/common/PaginationQuery.dto';
import { Trim } from 'src/common/trim.decorator';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { UserSummary } from '../domain/user/UsersQueryRepository';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export function getUserView(user: UserSummary): UserViewDto {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}

export class CreateUserInput {
  login: string;
  email: string;
  password: string;
  email_confirmation_code: string | null;
  email_confirmation_expire: Date | null;
  email_confirmation_is_confirmed: boolean | null;
}

export class CreateUserInputDto {
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Trim()
  @Length(6, 20)
  password: string;
}

type UsersSortBy = 'createdAt' | 'login' | 'email';

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  sortBy: UsersSortBy;
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
}
