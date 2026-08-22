import { User } from '../user.entity';

export class CreateUserCommand {
  constructor(
    readonly login: string,
    readonly email: string,
    readonly password: string,
  ) {}
}

export abstract class UsersCommandsRepository {
  abstract create(input: CreateUserCommand): User;
  // smth like update result
  abstract updateUserIsConfirmed(user: User, isConfirmed: boolean): any;
  abstract updateUserEmailConfirmation(user: User, emailConfirmation: any): any;
  abstract updatePasswordRecovery(user: User, passwordRecovery: any): any;
  abstract updatePassword(user: User, newPassword: string): any;
  abstract delete(id: string): any;
  abstract deleteAll(): any;
}
