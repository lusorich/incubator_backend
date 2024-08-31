import {
  Body,
  Controller,
  Injectable,
  PipeTransform,
  Post,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { IsUserAlreadyExist } from 'src/common/IsUserAlreadyExist';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(value: string) {
    console.log('value', value);

    return value;
  }
}

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
    console.log('try to login');

    return null;
  }

  @Post('registration')
  async userRegistration(@Body() userInput: RegistrationInputDto) {
    console.log('try to registration');

    return null;
  }
}
