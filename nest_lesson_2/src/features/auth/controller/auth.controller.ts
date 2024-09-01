import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { IsUserAlreadyExist } from 'src/common/IsUserAlreadyExist';

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
  constructor() {}

  @Post('login')
  async userLogin() {
    return null;
  }

  @Post('registration')
  async userRegistration(@Body() userInput: RegistrationInputDto) {
    return null;
  }
}
