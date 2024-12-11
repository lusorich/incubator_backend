import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CommentsQueryRepository } from 'src/features/comments/repositories/comments.repository.query';

@ValidatorConstraint({ async: true })
export class IsCommentExistConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly CommentsQueryRepository: CommentsQueryRepository,
  ) {}

  async validate(arg: string) {
    const comment = this.CommentsQueryRepository.getById(arg);

    if (!comment) {
      return false;
    }

    return true;
  }
}

export function IsCommentExist(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCommentExistConstraint,
    });
  };
}
