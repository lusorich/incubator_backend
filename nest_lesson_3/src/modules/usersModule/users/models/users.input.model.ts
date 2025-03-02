import { EmailConfirmation } from '../domain/user.entity';

export class CreateUserInput {
  login: string;
  email: string;
  password: string;
  emailConfirmation?: EmailConfirmation;
}
