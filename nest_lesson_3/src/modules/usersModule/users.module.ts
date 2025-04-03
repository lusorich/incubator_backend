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
import { NotificationModule } from '../notificationModule/notifications.module';
import { IsUserNotExistConstraint } from './guards/IsUserNotExist';
import { IsConfirmationCodeActiveConstraint } from './guards/IsConfirmationCodeActive';
import { IsEmailNotConfirmedConstraint } from './guards/IsEmailNotConfirmed';
import { IsPasswordRecoveryCodeUsedConstraint } from './guards/IsPasswordRecoveryCodeUsed';
import { IsUserAlreadyExistConstraint } from './guards/IsUserAlreadyExist';
import { IsUserByRecoveryCodeExistConstraint } from './guards/IsUserByRecoveryCodeExist';
import { JwtModule } from '@nestjs/jwt';
import { appSettings } from 'src/settings/appSettings';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/application/auth.local.strategy';
import { JwtStrategy } from './auth/application/auth.jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: appSettings.api.SECRET_JWT_KEY,
      signOptions: { expiresIn: '5m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CommonModule,
    NotificationModule,
    PassportModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthCommandsRepository,
    AuthService,
    UsersService,
    UsersCommandsRepository,
    UsersQueryRepository,
    IsUserNotExistConstraint,
    IsConfirmationCodeActiveConstraint,
    IsEmailNotConfirmedConstraint,
    IsPasswordRecoveryCodeUsedConstraint,
    IsUserAlreadyExistConstraint,
    IsUserByRecoveryCodeExistConstraint,
    IsUserByRecoveryCodeExistConstraint,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UsersQueryRepository, UsersService],
})
export class UsersModule {}
