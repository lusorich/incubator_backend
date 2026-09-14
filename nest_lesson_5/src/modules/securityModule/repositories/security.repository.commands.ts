import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Security,
  SecurityDocument,
  SecurityModelType,
} from '../domain/security.entity';
import { CreateDeviceSessionInput } from '../models/security.model';
import { Database } from 'src/modules/databaseModule/database';

@Injectable()
export class SecurityCommandsRepository {
  constructor(
    @InjectModel(Security.name) private SecurityModel: SecurityModelType,
    private database: Database,
  ) {}

  async createDeviceSession(createDeviceSessionInput: {
    user_id: string;
    device_id: string;
    device_name: string;
    iat: string | number;
    exp: Date;
    ip: string;
  }) {
    return await this.database
      .insertInto('security_devices')
      .values(createDeviceSessionInput)
      .returningAll()
      .executeTakeFirst();
  }

  async updateDeviceSession({
    userId,
    deviceId,
    iat,
    exp,
  }: {
    userId: string;
    deviceId: string;
    iat: number | string;
    exp: Date | string;
  }) {
    return await this.database
      .updateTable('security_devices')
      .set('iat', iat)
      .set('exp', exp)
      .where('user_id', '=', userId)
      .where('device_id', '=', deviceId)
      .executeTakeFirst();
  }

  async deleteDeviceSession({ deviceId }: { deviceId: string }) {
    return await this.database
      .deleteFrom('security_devices')
      .where('device_id', '=', deviceId)
      .executeTakeFirst();
  }

  async deleteUserSessionsExceptCurrent({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }) {
    return await this.database
      .deleteFrom('security_devices')
      .where((eb) =>
        eb.and([eb('user_id', '=', userId), eb('device_id', '!=', deviceId)]),
      )
      .executeTakeFirst();
  }

  async deleteAll() {
    await this.SecurityModel.deleteMany({});
    return await this.database.deleteFrom('security_devices').execute();
  }
  async save(deviceSession: SecurityDocument) {
    return deviceSession.save();
  }
}
