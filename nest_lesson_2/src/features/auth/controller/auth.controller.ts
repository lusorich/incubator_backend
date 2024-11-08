import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
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
import { Response } from 'express';

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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  async userLogin() {
    return null;
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

      await this.userService.updatePasswordRecovery(user, passwordRecovery);
    }
  }
}
