import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { appSettings } from 'src/settings/appSettings';

@Injectable()
export class AuthGuardBasic implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const basic = this.extractBasicFromHeader(request);

    if (!basic || basic !== 'Basic YWRtaW46cXdlcnR5') {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractBasicFromHeader(request: Request): string | undefined {
    return request.headers.authorization ?? null;
  }
}
