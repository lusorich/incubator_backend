import { UserDocument } from '../domain/user.entity';
import { EmailConfirmation } from '../domain/user.entity';

export class UserViewDto {
  private id: string;
  private login: string;
  private email: string;
  private createdAt: Date;

  static getUserView(user: UserDocument): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user.id;
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt;

    return dto;
  }
}

//TODO: we've createUserInputDto in controller
export class CreateUserInput {
  login: string;
  email: string;
  password: string;
  emailConfirmation?: EmailConfirmation;
}
