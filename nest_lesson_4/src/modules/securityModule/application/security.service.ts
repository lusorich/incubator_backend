import { Injectable } from '@nestjs/common';
import { SecurityCommandsRepository } from '../repositories/security.repository.commands';
import { CreateDeviceSessionInput } from '../models/security.model';
import { SecurityQueryRepository } from '../repositories/security.repository.query';
import { DomainException } from 'src/common/exceptions/domain.exceptions';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';

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

  async deleteDeviceSession({
    deviceId,
    userId,
  }: {
    deviceId: string;
    userId: string;
  }) {
    const sessionByDeviceId =
      await this.securityQueryRepository.getUserSessionByProperties({
        properties: [{ deviceId }],
      });

    if (!sessionByDeviceId) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'not found',
      });
    }

    if (userId !== sessionByDeviceId.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'error',
      });
    }

    return this.securityCommandsRepository.deleteDeviceSession({ deviceId });
  }

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
