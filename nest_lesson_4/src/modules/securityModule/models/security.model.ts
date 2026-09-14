import { formatISO, fromUnixTime, parseISO } from 'date-fns';
import { SecurityDocument } from '../domain/security.entity';

export class SecurityViewDto {
  private ip: string;
  private title: string;
  private lastActiveDate: Date;
  private deviceId: string;

  static getSecurityView(security: SecurityDocument): SecurityViewDto {
    const dto = new SecurityViewDto();

    dto.ip = security.ip;
    dto.title = security.deviceName;
    dto.lastActiveDate = parseISO(formatISO(fromUnixTime(security.iat)));
    dto.deviceId = security.deviceId;

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
