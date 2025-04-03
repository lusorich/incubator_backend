import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAfter } from 'date-fns';
import { UsersQueryRepository } from '../users/repositories/users.repository.query';

@ValidatorConstraint({ async: true })
export class IsPasswordRecoveryCodeUsedConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly UsersQueryRepository: UsersQueryRepository) {}

  async validate(arg: string) {
    const user = await this.UsersQueryRepository.getByProperty(
      'passwordRecovery.recoveryCode',
      arg,
    );

    if (user && isAfter(new Date(), user.passwordRecovery.expire)) {
      return false;
    }

    if (user && user.passwordRecovery.isUsed) {
      return false;
    }

    return true;
  }
}

export function IsPasswordRecoveryCodeUsed(
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordRecoveryCodeUsedConstraint,
    });
  };
}
