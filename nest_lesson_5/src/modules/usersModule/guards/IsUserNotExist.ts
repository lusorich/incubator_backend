import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from '../users/repositories/users.repository.query';

@ValidatorConstraint({ async: true })
export class IsUserNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly UsersQueryRepository: UsersQueryRepository) {}

  async validate(arg: string, options: ValidationArguments) {
    const property = options.property;
    const users = await this.UsersQueryRepository.getByProperty(property, arg);

    if (users.length > 0) {
      return false;
    }

    return true;
  }
}

export function IsUserNotExist(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserNotExistConstraint,
    });
  };
}
