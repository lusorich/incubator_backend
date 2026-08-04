import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAfter } from 'date-fns';
import { UsersQueryRepository } from '../users/domain/user/UsersQueryRepository';

@ValidatorConstraint({ async: true })
export class IsConfirmationCodeActiveConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly UsersQueryRepository: UsersQueryRepository) {}

  async validate(arg: string, options: ValidationArguments) {
    const user = await this.UsersQueryRepository.getByProperty(
      'email_confirmation_code',
      arg,
    );

    if (user && isAfter(new Date(), user.email_confirmation_expire)) {
      return false;
    }

    if (user && user.email_confirmation_is_confirmed) {
      return false;
    }

    return true;
  }
}

export function IsConfirmationCodeActive(
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsConfirmationCodeActiveConstraint,
    });
  };
}
