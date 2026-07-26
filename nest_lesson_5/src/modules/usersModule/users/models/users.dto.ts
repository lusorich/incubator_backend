import { BaseSortablePaginationParams } from 'src/common/PaginationQuery.dto';
import { Trim } from 'src/common/trim.decorator';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class UserViewDto {
  private id: string;
  private login: string;
  private email: string;
  private createdAt: Date;

  static getUserView(user: any): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user.id;
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.created_at.toISOString() as any;

    return dto;
  }
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
