import { Module } from '@nestjs/common';
import { SecurityController } from './controller/security.controller';
import { SecurityCommandsRepository } from './repositories/security.repository.commands';

@Module({
  imports: [],
  controllers: [SecurityController],
  providers: [SecurityCommandsRepository],
  exports: [SecurityCommandsRepository],
})
export class SecurityModule {}
