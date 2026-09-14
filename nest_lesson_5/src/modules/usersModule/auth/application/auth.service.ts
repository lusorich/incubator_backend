import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users.service';
import { appSettings } from 'src/settings/appSettings';
import { SecurityService } from 'src/modules/securityModule/application/security.service';
import { randomUUID } from 'crypto';
import { formatISO, fromUnixTime, parseISO } from 'date-fns';
import { EmailService } from 'src/modules/notificationModule/mail.service';
import { EmailConfirmation } from '../../users/domain/email-confirmation';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
    private readonly emailService: EmailService,
  ) {}

  async registration(userRegistrationInputModel) {
    const emailConfirmation = EmailConfirmation.generate();
    const emailTemplate =
      this.emailService.generateRegistrationConfirmationEmail({
        code: emailConfirmation.code,
      });

    await this.emailService.sendEmail({
      from: 'eeugern@mail.ru',
      to: userRegistrationInputModel.email,
      html: emailTemplate,
    });

    return this.usersService.create({
      ...userRegistrationInputModel,
      email_confirmation_code: emailConfirmation.code,
      email_confirmation_expire: emailConfirmation.expire,
      email_confirmation_is_confirmed: emailConfirmation.isConfirmed,
    });
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
  // done
  async login({ user, deviceName, ip }) {
    const payload = {
      login: user.login,
      email: user.email,
      userId: user.id,
      deviceId: randomUUID(),
      deviceName,
    };

    const { refreshToken, accessToken } = await this.getTokens(payload);
    const decodedRefreshToken = this.jwtService.decode(refreshToken);

    await this.securityService.createDeviceSession({
      userId: decodedRefreshToken.userId,
      deviceId: decodedRefreshToken.deviceId,
      deviceName: decodedRefreshToken.deviceName,
      iat: decodedRefreshToken.iat,
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
          expiresIn: '10s',
        },
      ),
      this.jwtService.sign(
        {
          ...payload,
        },
        {
          secret: appSettings.api.SECRET_REFRESH_TOKEN,
          //20s
          expiresIn: '20s',
        },
      ),
    ];

    return {
      accessToken,
      refreshToken,
    };
  }
}
