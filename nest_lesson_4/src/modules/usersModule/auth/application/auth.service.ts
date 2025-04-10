import { Injectable } from '@nestjs/common';
import { AuthCommandsRepository } from '../repositories/auth.repository.commands';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users.service';
import { appSettings } from 'src/settings/appSettings';
import { SecurityService } from 'src/modules/securityModule/application/security.service';
import { randomUUID } from 'crypto';
import { formatISO, fromUnixTime, parseISO } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly authCommandsRepository: AuthCommandsRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
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

    if (userByLogin && userByLogin.password === password) {
      return {
        login: userByLogin.login,
        email: userByLogin.email,
        id: userByLogin.id,
      };
    }

    if (userByEmail && userByEmail.password === password) {
      return {
        login: userByEmail.login,
        email: userByEmail.email,
        id: userByEmail.id,
      };
    }

    return null;
  }

  async login({ user, deviceName, ip }) {
    const payload = { login: user.login, email: user.email, userId: user.id };

    const { refreshToken, accessToken } = await this.getTokens(payload);
    const decodedRefreshToken = this.jwtService.decode(refreshToken);

    await this.securityService.createDeviceSession({
      userId: user.id,
      deviceId: randomUUID(),
      deviceName,
      iat: parseISO(formatISO(fromUnixTime(decodedRefreshToken.iat))),
      exp: parseISO(formatISO(fromUnixTime(decodedRefreshToken.exp))),
      ip,
    });

    return { refreshToken, accessToken };
  }

  async getTokens(payload) {
    const [accessToken, refreshToken] = [
      this.jwtService.sign(
        {
          ...payload,
        },
        {
          secret: appSettings.api.SECRET_ACCESS_TOKEN,
          //10s
          expiresIn: '5m',
        },
      ),
      this.jwtService.sign(
        {
          ...payload,
        },
        {
          secret: appSettings.api.SECRET_REFRESH_TOKEN,
          //20s
          expiresIn: '20m',
        },
      ),
    ];

    return {
      accessToken,
      refreshToken,
    };
  }
}
