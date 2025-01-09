import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from 'src/features/users/repositories/users.repository.query';

@ValidatorConstraint({ async: true })
export class IsUserByRecoveryCodeExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly UsersQueryRepository: UsersQueryRepository) {}

  async validate(arg: string) {
    const user = await this.UsersQueryRepository.getByProperty(
      'passwordRecovery.recoveryCode',
      arg,
    );

    if (!user) {
      return false;
    }

    return true;
  }
}

export function IsUserByRecoveryCodeExist(
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserByRecoveryCodeExistConstraint,
    });
  };
}
