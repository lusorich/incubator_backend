import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from 'src/features/users/repositories/users.repository.query';

@ValidatorConstraint({ async: true })
export class IsUserByConfirmationCodeExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly UsersQueryRepository: UsersQueryRepository) {}

  async validate(arg: string, options: ValidationArguments) {
    const user = await this.UsersQueryRepository.getByProperty(
      'emailConfirmation.code',
      arg,
    );

    if (!user) {
      return false;
    }

    return true;
  }
}

export function IsUserByConfirmationCodeExist(
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserByConfirmationCodeExistConstraint,
    });
  };
}
