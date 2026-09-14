import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Security } from '../domain/security.entity';
import { SecurityViewDto } from '../models/security.model';
import { Database } from 'src/modules/databaseModule/database';

@Injectable()
export class SecurityQueryRepository {
  constructor(
    @InjectModel(Security.name) private SecurityModel: Model<Security>,
    private database: Database,
  ) {}

  async getUserSessions({ userId }: { userId: string }) {
    const userSessions = await this.database
      .selectFrom('security_devices')
      .selectAll()
      .where('user_id', '=', userId)
      .execute();

    return (userSessions as any[]).map(SecurityViewDto.getSecurityView);
  }

  async getUserSessionByProperties({
    properties,
  }: {
    properties: Record<string, string>[];
  }) {
    const userSession = await this.SecurityModel.findOne({
      $and: properties,
    });
    return userSession;
  }

  async getUserSessionByDeviceId(deviceId: any) {
    const user = await this.database
      .selectFrom('security_devices')
      .selectAll()
      .where('device_id', '=', deviceId)
      .executeTakeFirst();

    return user;
  }

  async getUserSessionByPropertiesPg(properties: any) {
    const user = await this.database
      .selectFrom('security_devices')
      .selectAll()
      .where((eb) =>
        eb.and([
          eb('user_id', '=', properties.userId),
          eb('iat', '=', properties.iat),
          eb('device_id', '=', properties.deviceId),
        ]),
      )
      .executeTakeFirst();

    return user;
  }
}
