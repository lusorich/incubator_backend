import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string) {
    const user = await this.authService.validateUser(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    console.log('login', user);

    return { login: user.login, email: user.email, id: user.id };
  }
}
