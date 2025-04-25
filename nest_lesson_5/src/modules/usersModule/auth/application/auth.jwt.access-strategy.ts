import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appSettings } from 'src/settings/appSettings';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appSettings.api.SECRET_ACCESS_TOKEN,
      //10s
      signOptions: { expiresIn: '10s' },
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
