import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../application/local.auth.guard';
import { JwtAuthGuard } from '../application/jwt.auth.guard';
import { Trim } from 'src/common/trim.decorator';
import { UsersService } from '../../users/application/users.service';
import { IsUserNotExist } from '../../guards/IsUserNotExist';
import { IsUserByConfirmationCodeExist } from '../../guards/IsUserByConfirmationCodeExist';
import { IsConfirmationCodeActive } from '../../guards/IsConfirmationCodeActive';
import { IsUserAlreadyExist } from '../../guards/IsUserAlreadyExist';
import { IsEmailNotConfirmed } from '../../guards/IsEmailNotConfirmed';
import { IsUserByRecoveryCodeExist } from '../../guards/IsUserByRecoveryCodeExist';
import { IsPasswordRecoveryCodeUsed } from '../../guards/IsPasswordRecoveryCodeUsed';
import { EmailService } from 'src/modules/notificationModule/mail.service';
import { JwtRefreshAuthGuard } from '../application/jwt-refresh.auth.guard';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from 'src/modules/securityModule/application/security.service';
import { SkipThrottle } from '@nestjs/throttler';
import { DomainException } from 'src/common/exceptions/domain.exceptions';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';

class RegistrationInputDto {
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsUserNotExist({ message: 'login already exist' })
  login: string;

  @IsEmail()
  @IsUserNotExist({ message: 'email already exist' })
  email: string;

  @IsNotEmpty()
  @Trim()
  @Length(6, 20)
  password: string;
}

class RegistrationConfirmationInputDto {
  @IsNotEmpty()
  @IsUserByConfirmationCodeExist({ message: 'user dont exist' })
  @IsConfirmationCodeActive({
    message: 'code has already been activated or expired',
  })
  code: string;
}

class RegistrationEmailResendingInputDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUserAlreadyExist({ message: 'user dont exist' })
  @IsEmailNotConfirmed({ message: 'email already confirmed' })
  email: string;
}

class RegistrationEmailPasswordRecoveryInputDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class RegistrationNewPasswordInputDto {
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;

  @IsNotEmpty()
  @IsUserByRecoveryCodeExist({ message: 'wrong recovery code' })
  @IsPasswordRecoveryCodeUsed({ message: 'recovery code expired' })
  recoveryCode: string;
}

@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
  ) {}
  //TODO: Maybe wrong
  // done
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Request() req, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken } = await this.authService.login({
      user: req.user,
      deviceName: req.get('User-Agent') ?? 'unknown',
      ip: req.ip,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }
  // done
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistration(@Body() userInput: RegistrationInputDto) {
    const emailConfirmation =
      this.emailService.generateUserEmailConfirmationPg();
    const emailTemplate =
      this.emailService.generateRegistrationConfirmationEmail({
        code: emailConfirmation.email_confirmation_code,
      });
    // need try catch, but where?
    await this.emailService.sendEmail({
      from: 'eeugern@mail.ru',
      to: userInput.email,
      html: emailTemplate,
    });

    console.log('emailConfirmation', emailConfirmation);
    console.log('userInput', userInput);
    const newUser = await this.authService.registration({
      ...userInput,
      ...emailConfirmation,
    });

    return newUser;
  }

  // i don't like logic cause in guards we check our user by doing sql queries
  // and there we use getByProperty and search user again
  // done
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistationConfirmation(
    @Body() userInput: RegistrationConfirmationInputDto,
  ) {
    const user = await this.userService.getByProperty(
      'email_confirmation_code',
      userInput.code,
    );

    return await this.userService.updateUserIsConfirmed(user, true);
  }
  // done
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistrationEmailResending(
    @Body() userInput: RegistrationEmailResendingInputDto,
  ) {
    const user = await this.userService.getByProperty('email', userInput.email);

    const emailConfirmation = this.emailService.generateUserEmailConfirmation();
    const emailTemplate =
      this.emailService.generateRegistrationConfirmationEmail({
        code: emailConfirmation.code,
      });

    await this.emailService.sendEmail({
      html: emailTemplate,
      to: userInput.email,
      from: 'eeugern@mail.ru',
    });

    console.log('user resending', user);
    console.log('resending', emailConfirmation);

    return await this.userService.updateUserEmailConfirmation(
      user,
      emailConfirmation,
    );
  }
  // done
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistrationPasswordRecovery(
    @Body() userInput: RegistrationEmailPasswordRecoveryInputDto,
  ) {
    const user = await this.userService.getByProperty('email', userInput.email);

    if (user) {
      if (user.email_confirmation_is_confirmed) {
        throw new DomainException({
          code: DomainExceptionCode.BadRequest,
          errorsMessages: [{ field: 'email', message: 'not correct' }],
        });
      }
      const passwordRecovery =
        this.emailService.generatePasswordRecoveryConfirmation();
      const emailTemplate = this.emailService.generateRecoveryPasswordEmail({
        recoveryCode: passwordRecovery.recoveryCode,
      });

      await this.emailService.sendEmail({
        html: emailTemplate,
        to: userInput.email,
        from: 'eeugern@mail.ru',
      });

      return await this.userService.updatePasswordRecovery(
        user,
        passwordRecovery,
      );
    }
  }
  //done but need refactoring
  @SkipThrottle()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async updateTokens(@Request() req, @Res({ passthrough: true }) res) {
    const decodedPrevRefreshToken = this.jwtService.decode(
      req.user.refreshToken,
    );

    const payload = {
      login: decodedPrevRefreshToken.login,
      email: decodedPrevRefreshToken.email,
      userId: decodedPrevRefreshToken.userId,
      deviceId: decodedPrevRefreshToken.deviceId,
      deviceName: decodedPrevRefreshToken.deviceName,
    };

    const { accessToken, refreshToken } =
      await this.authService.getTokens(payload);
    const decodedRefreshToken = this.jwtService.decode(refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    await this.securityService.updateDeviceSession({
      userId: decodedPrevRefreshToken.userId,
      deviceId: decodedPrevRefreshToken.deviceId,
      iat: decodedRefreshToken?.iat ?? '',
      exp: decodedRefreshToken?.exp
        ? new Date(decodedRefreshToken.exp * 1000)
        : '',
    });

    return { accessToken };
  }
  // done
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistrationNewPassword(
    @Body() userInput: RegistrationNewPasswordInputDto,
  ) {
    const user = await this.userService.getByProperty(
      'password_recovery_code',
      userInput.recoveryCode,
    );

    await this.userService.updatePasswordRecovery(user, {
      isUsed: true,
      recoveryCode: null,
      expire: null,
    });

    return await this.userService.updatePassword(user, userInput.newPassword);
  }
  // done
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async userInfo(@Request() req) {
    return req.user;
  }
  // done
  @SkipThrottle()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req) {
    const { userId, deviceId } = req.user;

    return await this.securityService.deleteDeviceSession({ userId, deviceId });
  }
}
