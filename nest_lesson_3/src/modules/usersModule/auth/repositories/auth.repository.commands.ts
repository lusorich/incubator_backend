import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';

@Injectable()
export class AuthCommandsRepository {
  constructor(private readonly UsersService: UsersService) {}

  async registration(registrationUserInputModel) {
    return this.UsersService.create(registrationUserInputModel);
  }
}
