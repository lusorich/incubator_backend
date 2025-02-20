import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationModule {}
