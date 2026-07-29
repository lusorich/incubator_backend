import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Trim } from 'src/common/trim.decorator';
import { IsUserNotExist } from '../../guards/IsUserNotExist';
import { IsUserByConfirmationCodeExist } from '../../guards/IsUserByConfirmationCodeExist';
import { IsConfirmationCodeActive } from '../../guards/IsConfirmationCodeActive';
import { IsUserAlreadyExist } from '../../guards/IsUserAlreadyExist';
import { IsEmailNotConfirmed } from '../../guards/IsEmailNotConfirmed';
import { IsUserByRecoveryCodeExist } from '../../guards/IsUserByRecoveryCodeExist';
import { IsPasswordRecoveryCodeUsed } from '../../guards/IsPasswordRecoveryCodeUsed';

export class RegistrationInputDto {
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

export class RegistrationConfirmationInputDto {
  @IsNotEmpty()
  @IsUserByConfirmationCodeExist({ message: 'user dont exist' })
  @IsConfirmationCodeActive({
    message: 'code has already been activated or expired',
  })
  code: string;
}

export class RegistrationEmailResendingInputDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUserAlreadyExist({ message: 'user dont exist' })
  @IsEmailNotConfirmed({ message: 'email already confirmed' })
  email: string;
}

export class RegistrationEmailPasswordRecoveryInputDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class RegistrationNewPasswordInputDto {
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;

  @IsNotEmpty()
  @IsUserByRecoveryCodeExist({ message: 'wrong recovery code' })
  @IsPasswordRecoveryCodeUsed({ message: 'recovery code expired' })
  recoveryCode: string;
}
