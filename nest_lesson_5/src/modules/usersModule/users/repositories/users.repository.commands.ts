import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { CreateUserInput } from '../models/users.dto';
import { Database } from 'src/modules/databaseModule/database';

@Injectable()
export class UsersCommandsRepository {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private database: Database,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const user = this.database
      .insertInto('users')
      .values(createUserInput)
      .returningAll()
      .executeTakeFirstOrThrow();

    return user;
  }

  async save(user: UserDocument) {
    return user.save();
  }

  async updateUserIsConfirmed(user, isConfirmed) {
    return await this.database
      .updateTable('users')
      .set('email_confirmation_is_confirmed', isConfirmed)
      .where('id', '=', user.id)
      .executeTakeFirst();
  }

  async updateUserEmailConfirmation(user, emailConfirmation) {
    return await this.database
      .updateTable('users')
      .set('email_confirmation_is_confirmed', emailConfirmation.isConfirmed)
      .set('email_confirmation_code', emailConfirmation.code)
      .set('email_confirmation_expire', emailConfirmation.expire)
      .where('login', '=', user.login)
      .executeTakeFirst();
  }

  async updatePasswordRecovery(user, passwordRecovery) {
    return await this.database
      .updateTable('users')
      .set('password_recovery_is_used', passwordRecovery.isUsed)
      .set('password_recovery_code', passwordRecovery.recoveryCode)
      .set('password_recovery_expire', passwordRecovery.expire)
      .where('login', '=', user.login)
      .executeTakeFirst();
  }

  async updatePassword(user, newPassword) {
    return await this.database
      .updateTable('users')
      .set('password', newPassword)
      .where('login', '=', user.login)
      .executeTakeFirst();
  }

  async delete(id: string) {
    try {
      return await this.UserModel.deleteOne({ _id: id });
    } catch (e) {
      return { deletedCount: 0 };
    }
  }

  async deleteAll() {
    return this.UserModel.deleteMany({});
  }
}
