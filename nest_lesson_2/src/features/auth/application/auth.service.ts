import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCommandsRepository } from '../repositories/auth.repository.commands';
import { UsersService } from 'src/features/users/application/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authCommandsRepository: AuthCommandsRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
      return {
        login: userByLogin.login,
        email: userByLogin.email,
        id: userByLogin.id,
      };
    }

    if (userByEmail && userByEmail.password) {
      return {
        login: userByEmail.login,
        email: userByEmail.email,
        id: userByEmail.id,
      };
    }

    return null;
  }

  async login(user) {
    const payload = { login: user.login, email: user.email, userId: user.id };

    console.log('payload', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
