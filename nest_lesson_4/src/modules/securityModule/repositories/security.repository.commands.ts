import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Security,
  SecurityDocument,
  SecurityModelType,
} from '../domain/security.entity';
import { CreateDeviceSessionInput } from '../models/security.model';

@Injectable()
export class SecurityCommandsRepository {
  constructor(
    @InjectModel(Security.name) private SecurityModel: SecurityModelType,
  ) {}

  async createDeviceSession(
    createDeviceSessionInput: CreateDeviceSessionInput,
  ) {
    const deviceSession: SecurityDocument =
      this.SecurityModel.createDeviceSession(createDeviceSessionInput);

    return this.save(deviceSession);
  }

  async updateDeviceSession({
    userId,
    deviceId,
    iat,
    exp,
  }: {
    userId: string;
    deviceId: string;
    iat: string;
    exp: string;
  }) {
    return this.SecurityModel.updateOne(
      {
        $and: [{ userId }, { deviceId }],
      },
      {
        $set: { iat, exp },
      },
    );
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
