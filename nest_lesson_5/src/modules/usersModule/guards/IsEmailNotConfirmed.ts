import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from '../users/domain/user/UsersQueryRepository';

@ValidatorConstraint({ async: true })
export class IsEmailNotConfirmedConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly UsersQueryRepository: UsersQueryRepository) {}

  async validate(arg: string, options: ValidationArguments) {
    const property = options.property;

    const user = await this.UsersQueryRepository.getByProperty(property, arg);

    if (user && user.email_confirmation_is_confirmed) {
      return false;
    }

    return true;
  }
}

export function IsEmailNotConfirmed(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotConfirmedConstraint,
    });
  };
}
