import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateDeviceSessionInput } from '../models/security.model';

@Schema()
export class Security {
  @Prop()
  userId: string;

  @Prop()
  deviceId: string;

  @Prop()
  deviceName: string;

  @Prop()
  iat: number;

  @Prop()
  exp: Date;

  @Prop()
  ip: string;

  static createDeviceSession(
    createDeviceSessionInput: CreateDeviceSessionInput,
  ): SecurityDocument {
    const deviceSession = new this();

    deviceSession.userId = createDeviceSessionInput.userId;
    deviceSession.deviceId = createDeviceSessionInput.deviceId;
    deviceSession.ip = createDeviceSessionInput.ip;
    deviceSession.exp = createDeviceSessionInput.exp;
    deviceSession.iat = createDeviceSessionInput.iat;
    deviceSession.deviceName = createDeviceSessionInput.deviceName;

    return deviceSession as SecurityDocument;
  }
}

export const SecuritySchema = SchemaFactory.createForClass(Security);

SecuritySchema.loadClass(Security);

export type SecurityDocument = HydratedDocument<Security>;

type SecurityDeviceSessionStaticType = {
  createDeviceSession: (
    createDeviceSessionInput: CreateDeviceSessionInput,
  ) => SecurityDocument;
};

export type SecurityModelType = Model<SecurityDocument> &
  SecurityDeviceSessionStaticType;
