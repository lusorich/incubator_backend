import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { IsUserAlreadyExist } from 'src/common/IsUserAlreadyExist';
import { AuthService } from '../application/auth.service';
import { EmailService } from 'src/features/mail/application/mail.service';
import {
  IsConfirmationCodeActive,
  IsConfirmationCodeActiveConstraint,
} from 'src/common/IsConfirmationCodeActive';

class RegistrationInputDto {
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsUserAlreadyExist({ message: 'login already exist' })
  login: string;

  @IsEmail()
  @IsUserAlreadyExist({ message: 'email already exist' })
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}

class RegistrationConfirmationInputDto {
  @IsNotEmpty()
  @IsConfirmationCodeActive({ message: 'code has already been activated' })
  code: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
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
  ) {}
}
