import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DomainException } from './exceptions/domain.exceptions';
import { DomainExceptionCode } from './exceptions/domain.exception.codes';

@Injectable()
export class AuthGuardBasic implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const basic = this.extractBasicFromHeader(request);

    if (!basic || basic !== 'Basic YWRtaW46cXdlcnR5') {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Unauthorized',
      });
    }

    return true;
  }

  private extractBasicFromHeader(request: Request): string | undefined {
    return request.headers.authorization ?? null;
  }
}
