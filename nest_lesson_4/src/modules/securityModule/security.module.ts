import { Module } from '@nestjs/common';
import { SecurityController } from './controller/security.controller';

@Module({
  imports: [],
  controllers: [SecurityController],
  providers: [],
  exports: [],
})
export class SecurityModule {}
