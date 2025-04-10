import { Injectable } from '@nestjs/common';
import { SecurityCommandsRepository } from '../repositories/security.repository.commands';
import { CreateDeviceSessionInput } from '../models/security.model';

@Injectable()
export class SecurityService {
  constructor(
    private readonly securityCommandsRepository: SecurityCommandsRepository,
  ) {}

  async createDeviceSession(
    createDeviceSessionInput: CreateDeviceSessionInput,
  ) {
    return this.securityCommandsRepository.createDeviceSession(
      createDeviceSessionInput,
    );
  }
}
