import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appSettings } from 'src/settings/appSettings';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appSettings.api.SECRET_REFRESH_TOKEN,
      passReqToCallback: true,
      signOptions: { expiresIn: '20s' },
    });
  }

  async validate(req: Request, payload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    return { ...payload, refreshToken };
  }
}
