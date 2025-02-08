import { Module } from '@nestjs/common';
import { AuthController } from './auth/controller/auth.controller';
import { UsersController } from './users/controller/users.controller';
import { AuthCommandsRepository } from './auth/repositories/auth.repository.commands';
import { AuthService } from './auth/application/auth.service';
import { UsersService } from './users/application/users.service';
import { UsersQueryRepository } from './users/repositories/users.repository.query';
import { UsersCommandsRepository } from './users/repositories/users.repository.commands';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/user.entity';
import { CommonModule } from '../commonModule/common.module';
import { EmailService } from 'src/features/mail/application/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CommonModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthCommandsRepository,
    AuthService,
    UsersService,
    UsersCommandsRepository,
    UsersQueryRepository,
  ],
  exports: [UsersQueryRepository, UsersService],
})
export class UsersModule {}
