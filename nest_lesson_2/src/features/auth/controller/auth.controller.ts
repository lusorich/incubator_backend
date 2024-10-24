import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { IsUserAlreadyExist } from 'src/common/IsUserAlreadyExist';
import { AuthService } from '../application/auth.service';
import { EmailService } from 'src/features/mail/application/mail.service';

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
    console.log(this.emailService.generateUserEmailConfirmation());
    return await this.authService.registration(userInput);
  }
}
