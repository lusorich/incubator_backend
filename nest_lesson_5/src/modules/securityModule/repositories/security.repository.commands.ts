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
    console.log('upadte deviceSession');

    const hm = await this.database
      .updateTable('security_devices')
      .set('iat', iat)
      .set('exp', exp)
      .where('user_id', '=', userId)
      .where('device_id', '=', deviceId)
      .executeTakeFirst();

    console.log('hm', hm);

    return hm;
  }

  async deleteDeviceSession({ deviceId }: { deviceId: string }) {
    return this.SecurityModel.deleteOne({ deviceId });
  }

  async deleteUserSessionsExceptCurrent({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }) {
    return this.SecurityModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async deleteAll() {
    return this.SecurityModel.deleteMany({});
  }
  async save(deviceSession: SecurityDocument) {
    return deviceSession.save();
  }
}
