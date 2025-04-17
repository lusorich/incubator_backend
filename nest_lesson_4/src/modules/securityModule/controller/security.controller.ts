import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from 'src/modules/usersModule/auth/application/jwt-refresh.auth.guard';
import { SecurityViewDto } from '../models/security.model';
import { SecurityQueryRepository } from '../repositories/security.repository.query';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityQueryRepository: SecurityQueryRepository,
  ) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('devices')
  async getDevices(@Request() req): Promise<SecurityViewDto[]> {
    return await this.securityQueryRepository.getUserSessions({
      userId: req.user.userId,
    });
  }
}
