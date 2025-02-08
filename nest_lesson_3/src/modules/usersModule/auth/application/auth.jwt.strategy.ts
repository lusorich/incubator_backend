import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appSettings } from 'src/settings/appSettings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appSettings.api.SECRET_JWT_KEY,
    });
  }

  async validate(payload) {
    return {
      userId: payload.userId,
      login: payload.login,
      email: payload.email,
    };
  }
}
