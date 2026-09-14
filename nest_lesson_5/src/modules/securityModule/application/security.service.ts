import { Injectable } from '@nestjs/common';
import { SecurityCommandsRepository } from '../repositories/security.repository.commands';
import { CreateDeviceSessionInput } from '../models/security.model';
import { SecurityQueryRepository } from '../repositories/security.repository.query';
import { DomainException } from 'src/common/exceptions/domain.exceptions';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';
import { Database } from 'src/modules/databaseModule/database';

@Injectable()
export class SecurityService {
  constructor(
    private readonly securityCommandsRepository: SecurityCommandsRepository,
    private readonly securityQueryRepository: SecurityQueryRepository,
    private database: Database,
  ) {}

  async createDeviceSession(
    createDeviceSessionInput: CreateDeviceSessionInput,
  ) {
    return this.securityCommandsRepository.createDeviceSession({
      device_id: createDeviceSessionInput.deviceId,
      device_name: createDeviceSessionInput.deviceName,
      user_id: createDeviceSessionInput.userId,
      exp: createDeviceSessionInput.exp,
      iat: createDeviceSessionInput.iat,
      ip: createDeviceSessionInput.ip,
    });
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

  async getUserSessionByPropertiesPg(properties: any) {
    return this.securityQueryRepository.getUserSessionByPropertiesPg(
      properties,
    );
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
    exp: Date | string;
  }) {
    return this.securityCommandsRepository.updateDeviceSession({
      userId,
      deviceId,
      iat,
      exp,
    });
  }

  async deleteDeviceSession({
    deviceId,
    userId,
  }: {
    deviceId: string;
    userId: string;
  }) {
    const sessionByDeviceId =
      await this.securityQueryRepository.getUserSessionByDeviceId(deviceId);

    console.log('sessionByDeviceId', sessionByDeviceId);

    if (!sessionByDeviceId) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'not found',
      });
    }

    if (userId !== sessionByDeviceId.user_id) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'error',
      });
    }

    return this.securityCommandsRepository.deleteDeviceSession({ deviceId });
  }
  //done
  async deleteUserSessionsExceptCurrent({
    deviceId,
    userId,
  }: {
    deviceId: string;
    userId: string;
  }) {
    return this.securityCommandsRepository.deleteUserSessionsExceptCurrent({
      deviceId,
      userId,
    });
  }

  async deleteAll() {
    return this.securityCommandsRepository.deleteAll();
  }
}
