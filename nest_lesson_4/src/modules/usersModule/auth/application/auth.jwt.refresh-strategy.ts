import { HttpCode, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';
import { DomainException } from 'src/common/exceptions/domain.exceptions';
import { SecurityService } from 'src/modules/securityModule/application/security.service';
import { appSettings } from 'src/settings/appSettings';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private securityService: SecurityService) {
    super({
      jwtFromRequest: (req: Request) => req.cookies.refreshToken,
      ignoreExpiration: false,
      secretOrKey: appSettings.api.SECRET_REFRESH_TOKEN,
      passReqToCallback: true,
      //20s
      signOptions: { expiresIn: '20m' },
    });
  }

  async validate(req: Request, payload) {
    const refreshToken = req.cookies.refreshToken;
    let userSession = null;

    try {
      userSession = await this.securityService.getUserSessionByProperties({
        properties: [
          { deviceId: payload.deviceId },
          { userId: payload.userId },
          { iat: payload.iat },
        ],
      });
    } catch (e) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'unauthorized',
      });
    }

    if (!userSession) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'unauthorized',
      });
    }

    return { ...payload, refreshToken };
  }
}
