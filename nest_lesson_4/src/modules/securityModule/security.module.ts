import { Module } from '@nestjs/common';
import { SecurityController } from './controller/security.controller';
import { SecurityCommandsRepository } from './repositories/security.repository.commands';
import { SecurityService } from './application/security.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Security, SecuritySchema } from './domain/security.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Security.name, schema: SecuritySchema },
    ]),
  ],
  controllers: [SecurityController],
  providers: [SecurityCommandsRepository, SecurityService],
  exports: [SecurityService],
})
export class SecurityModule {}
