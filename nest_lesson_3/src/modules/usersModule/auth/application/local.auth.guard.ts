import {
  BadGatewayException,
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const { loginOrEmail, password } = request.body;

    if (!loginOrEmail) {
      throw new BadRequestException({
        field: 'loginOrEmail',
        message: [{ field: 'loginOrEmail', message: 'not correct' }],
      });
    }

    if (!password) {
      throw new BadGatewayException({
        field: 'password',
        message: [{ field: 'password', message: 'not correct' }],
      });
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
