import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { AuthService } from '../application/auth.service';
import { EmailService } from 'src/features/mail/application/mail.service';
import { IsConfirmationCodeActive } from 'src/common/IsConfirmationCodeActive';
import { IsUserByConfirmationCodeExist } from 'src/common/IsUserByConfirmationCodeExist';
import { UsersService } from 'src/features/users/application/users.service';
import { IsEmailNotConfirmed } from 'src/common/IsEmailNotConfirmed';
import { IsUserNotExist } from 'src/common/IsUserNotExist';
import { IsUserAlreadyExist } from 'src/common/IsUserAlreadyExist';
import { IsUserByRecoveryCodeExist } from 'src/common/IsUserByRecoveryCodeExist';
import { IsPasswordRecoveryCodeUsed } from 'src/common/IsPasswordRecoveryCodeUsed';
import { LocalAuthGuard } from '../application/local.auth.guard';
import { JwtAuthGuard } from '../application/jwt.auth.guard';

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

class UserLoginInputDto {
  @IsNotEmpty()
  loginOrEmail: string;

  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async userLogin(@Request() req, @Body() userInput: UserLoginInputDto) {
    return this.authService.login(req.user);
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async userInfo(@Request() req) {
    return req.user;
  }
}
