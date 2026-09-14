import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Security } from '../domain/security.entity';
import { SecurityViewDto } from '../models/security.model';

@Injectable()
export class SecurityQueryRepository {
  constructor(
    @InjectModel(Security.name) private SecurityModel: Model<Security>,
  ) {}

  async getUserSessions({ userId }: { userId: string }) {
    const userSessions = await this.SecurityModel.find({ userId });

    return userSessions.map(SecurityViewDto.getSecurityView);
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
}
