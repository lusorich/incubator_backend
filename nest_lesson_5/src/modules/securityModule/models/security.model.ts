import { formatISO, fromUnixTime, parseISO } from 'date-fns';
import { SecurityDocument } from '../domain/security.entity';

export class SecurityViewDto {
  private ip: string;
  private title: string;
  private lastActiveDate: Date;
  private deviceId: string;

  static getSecurityView(security: any): SecurityViewDto {
    const dto = new SecurityViewDto();

    dto.ip = security.ip;
    dto.title = security.device_name;
    dto.lastActiveDate = fromUnixTime(security.iat).toISOString() as any;
    dto.deviceId = security.device_id;

    return dto;
  }
}

export class CreateDeviceSessionInput {
  userId: string;
  deviceId: string;
  deviceName: string;
  iat: number;
  exp: Date;
  ip: string;
}
