import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAfter } from 'date-fns';
import { UsersQueryRepository } from '../users/repositories/users.repository.query';

@ValidatorConstraint({ async: true })
export class IsConfirmationCodeActiveConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly UsersQueryRepository: UsersQueryRepository) {}

  async validate(arg: string, options: ValidationArguments) {
    const user = await this.UsersQueryRepository.getByProperty(
      'emailConfirmation.code',
      arg,
    );

    if (user && isAfter(new Date(), user.emailConfirmation.expire)) {
      return false;
    }

    if (user && user.emailConfirmation.isConfirmed) {
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
