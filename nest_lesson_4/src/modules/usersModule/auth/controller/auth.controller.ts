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

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistration(@Body() userInput: RegistrationInputDto) {
    const emailConfirmation = this.emailService.generateUserEmailConfirmation();
    const emailTemplate =
      this.emailService.generateRegistrationConfirmationEmail({
        code: emailConfirmation.code,
      });

    await this.emailService.sendEmail({
      from: 'eeugern@mail.ru',
      to: userInput.email,
      html: emailTemplate,
    });

    return await this.authService.registration({
      ...userInput,
      emailConfirmation,
    });
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistationConfirmation(
    @Body() userInput: RegistrationConfirmationInputDto,
  ) {
    const user = await this.userService.getByProperty(
      'emailConfirmation.code',
      userInput.code,
    );

    return await this.userService.updateUserIsConfirmed(user, true);
  }

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

    return await this.userService.updateUserEmailConfirmation(
      user,
      emailConfirmation,
    );
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistrationPasswordRecovery(
    @Body() userInput: RegistrationEmailPasswordRecoveryInputDto,
  ) {
    const user = await this.userService.getByProperty('email', userInput.email);

    if (user) {
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

      return await this.userService.updatePasswordRecovery(user);
    }
  }

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
      exp: decodedRefreshToken?.exp ?? '',
    });

    return { accessToken };
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async userRegistrationNewPassword(
    @Body() userInput: RegistrationNewPasswordInputDto,
  ) {
    const user = await this.userService.getByProperty(
      'passwordRecovery.recoveryCode',
      userInput.recoveryCode,
    );

    await this.userService.updatePasswordRecovery(user);

    return await this.userService.updatePassword(user, userInput.newPassword);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async userInfo(@Request() req) {
    return req.user;
  }
}
