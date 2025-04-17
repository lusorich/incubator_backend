import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtRefreshAuthGuard } from 'src/modules/usersModule/auth/application/jwt-refresh.auth.guard';
import { SecurityViewDto } from '../models/security.model';
import { SecurityQueryRepository } from '../repositories/security.repository.query';
import { SecurityService } from '../application/security.service';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityQueryRepository: SecurityQueryRepository,
    private readonly securityService: SecurityService,
  ) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('devices')
  async getDevices(@Request() req): Promise<SecurityViewDto[]> {
    return await this.securityQueryRepository.getUserSessions({
      userId: req.user.userId,
    });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeviceSession(
    @Request() req,
    @Param('deviceId') deviceId: string,
  ) {
    return await this.securityService.deleteDeviceSession({
      deviceId,
      userId: req.user.userId,
    });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserSessionsExceptCurrent(@Request() req) {
    return await this.securityService.deleteUserSessionsExceptCurrent({
      deviceId: req.user.deviceId,
      userId: req.user.userId,
    });
  }
}
