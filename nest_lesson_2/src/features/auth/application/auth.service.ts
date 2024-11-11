import { Injectable } from '@nestjs/common';
import { AuthCommandsRepository } from '../repositories/auth.repository.commands';
import { UsersService } from 'src/features/users/application/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authCommandsRepository: AuthCommandsRepository,
    private readonly usersService: UsersService,
  ) {}

  async registration(userRegistrationInputModel) {
    return this.authCommandsRepository.registration(userRegistrationInputModel);
  }

  //TODO: bcrypt
  async validateUser(loginOrEmail: string, password: string) {
    const userByLogin = await this.usersService.getByProperty(
      'login',
      loginOrEmail,
    );
    const userByEmail = await this.usersService.getByProperty(
      'email',
      loginOrEmail,
    );

    if (userByLogin && userByLogin.password) {
      const { password, ...rest } = userByLogin;

      return rest;
    }

    if (userByEmail && userByEmail.password) {
      const { password, ...rest } = userByEmail;

      return rest;
    }

    return null;
  }
}
