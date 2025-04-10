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

    console.log('deviceSession', deviceSession);

    return this.save(deviceSession);
  }

  async save(deviceSession: SecurityDocument) {
    return deviceSession.save();
  }
}
