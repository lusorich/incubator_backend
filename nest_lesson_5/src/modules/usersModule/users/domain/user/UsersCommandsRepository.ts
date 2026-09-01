import { EmailConfirmation } from '../email-confirmation';
import { PasswordConfirmation } from '../password-confirmation';
import { User } from '../user.entity';

export class CreateUserCommand {
  constructor(
    readonly login: string,
    readonly email: string,
    readonly password: string,
  ) {}
}

export abstract class UsersCommandsRepository {
  abstract create(input: CreateUserCommand): Promise<User>;
  abstract updateUserIsConfirmed(
    user: User,
    isConfirmed: boolean,
  ): Promise<boolean>;
  abstract updateUserEmailConfirmation(
    user: User,
    emailConfirmation: EmailConfirmation,
  ): Promise<boolean>;
  abstract updatePasswordRecovery(
    user: User,
    passwordRecovery: PasswordConfirmation,
  ): Promise<boolean>;
  abstract updatePassword(user: User, newPassword: string): Promise<boolean>;
  abstract delete(id: string): Promise<boolean>;
  abstract deleteAll(): any;
}
