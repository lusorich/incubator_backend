import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/features/users/application/users.service';

@Injectable()
export class AuthCommandsRepository {
  constructor(private readonly UsersService: UsersService) {}

  async registration(registrationUserInputModel) {
    return this.UsersService.create(
      registrationUserInputModel.login,
      registrationUserInputModel.email,
    );
  }
}
