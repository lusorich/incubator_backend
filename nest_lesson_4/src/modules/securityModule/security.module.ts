import { Module } from '@nestjs/common';
import { SecurityController } from './controller/security.controller';
import { SecurityCommandsRepository } from './repositories/security.repository.commands';
import { SecurityService } from './application/security.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Security, SecuritySchema } from './domain/security.entity';
import { SecurityQueryRepository } from './repositories/security.repository.query';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Security.name, schema: SecuritySchema },
    ]),
  ],
  controllers: [SecurityController],
  providers: [
    SecurityQueryRepository,
    SecurityCommandsRepository,
    SecurityService,
  ],
  exports: [SecurityService],
})
export class SecurityModule {}
