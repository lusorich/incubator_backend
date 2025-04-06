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
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/application/auth.local.strategy';
import { JwtAccessStrategy } from './auth/application/auth.jwt.access-strategy';
import { JwtRefreshStrategy } from './auth/application/auth.jwt.refresh-strategy';
import { JwtModule } from '@nestjs/jwt';
import { appSettings } from 'src/settings/appSettings';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: appSettings.api.SECRET_ACCESS_TOKEN,
      signOptions: { expiresIn: '5m' },
    }),
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
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [UsersQueryRepository, UsersService],
})
export class UsersModule {}
