import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from 'src/modules/usersModule/auth/application/jwt-refresh.auth.guard';

@Controller('security')
export class SecurityController {
  @UseGuards(JwtRefreshAuthGuard)
  @Get('devices')
  async getDevices(@Request() req): Promise<any[]> {
    console.log('req', req?.user);

    return [];
  }
}
