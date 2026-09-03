import { Module } from '@nestjs/common';
import { AuthController } from './auth/controller/auth.controller';
import { UsersController } from './users/controller/users.controller';
import { AuthService } from './auth/application/auth.service';
import { UsersService } from './users/application/users.service';
import { KyselyUsersCommandsRepository } from './users/repositories/users.repository.commands';
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
import { SecurityModule } from '../securityModule/security.module';
import { IsUserByConfirmationCodeExistConstraint } from './guards/IsUserByConfirmationCodeExist';
import { UsersQueryRepository } from './users/domain/user/UsersQueryRepository';
import { KyselyUsersQueryRepository } from './users/repositories/users.repository.query';
import { UsersCommandsRepository } from './users/domain/user/UsersCommandsRepository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: appSettings.api.SECRET_ACCESS_TOKEN,
      signOptions: { expiresIn: '5m' },
    }),
    CommonModule,
    NotificationModule,
    PassportModule,
    SecurityModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    UsersService,
    {
      provide: UsersCommandsRepository,
      useClass: KyselyUsersCommandsRepository,
    },
    { provide: UsersQueryRepository, useClass: KyselyUsersQueryRepository },
    IsUserNotExistConstraint,
    IsConfirmationCodeActiveConstraint,
    IsEmailNotConfirmedConstraint,
    IsPasswordRecoveryCodeUsedConstraint,
    IsUserAlreadyExistConstraint,
    IsUserByRecoveryCodeExistConstraint,
    IsUserByConfirmationCodeExistConstraint,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [UsersQueryRepository, UsersService],
})
export class UsersModule {}
