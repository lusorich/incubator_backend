import { Injectable } from '@nestjs/common';
import { SecurityCommandsRepository } from '../repositories/security.repository.commands';
import { CreateDeviceSessionInput } from '../models/security.model';
import { SecurityQueryRepository } from '../repositories/security.repository.query';

@Injectable()
export class SecurityService {
  constructor(
    private readonly securityCommandsRepository: SecurityCommandsRepository,
    private readonly securityQueryRepository: SecurityQueryRepository,
  ) {}

  async createDeviceSession(
    createDeviceSessionInput: CreateDeviceSessionInput,
  ) {
    return this.securityCommandsRepository.createDeviceSession(
      createDeviceSessionInput,
    );
  }

  async getUserSessionByProperties({
    properties,
  }: {
    properties: Record<string, string>[];
  }) {
    return this.securityQueryRepository.getUserSessionByProperties({
      properties,
    });
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
    return this.securityCommandsRepository.updateDeviceSession({
      userId,
      deviceId,
      iat,
      exp,
    });
  }
}
