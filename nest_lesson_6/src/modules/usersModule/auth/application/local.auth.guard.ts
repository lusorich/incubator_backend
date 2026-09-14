import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';
import { DomainException } from 'src/common/exceptions/domain.exceptions';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const { loginOrEmail, password } = request.body;

    if (!loginOrEmail) {
      throw new DomainException({
        code: DomainExceptionCode.ValidationError,
        errorsMessages: [{ field: 'loginOrEmail', message: 'not correct' }],
      });
    }

    if (!password) {
      throw new DomainException({
        code: DomainExceptionCode.ValidationError,
        errorsMessages: [{ field: 'password', message: 'not correct' }],
      });
    }

    if (err || !user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'something went wrong',
      });
    }

    return user;
  }
}
