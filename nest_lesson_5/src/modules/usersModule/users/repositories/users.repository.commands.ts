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
    const up = await this.database
      .updateTable('users')
      .set('email_confirmation_is_confirmed', isConfirmed)
      .where('id', '=', user.id)
      .executeTakeFirst();

    return up;
  }

  async updateUserEmailConfirmation(user, emailConfirmation) {
    return this.UserModel.updateOne(
      { login: user.login },
      { $set: { emailConfirmation } },
    );
  }

  async updatePasswordRecovery(user) {
    return this.UserModel.updateOne(
      { login: user.login },
      { $set: { 'passwordRecovery.isUsed': true } },
    );
  }

  async updatePassword(user, newPassword) {
    return this.UserModel.updateOne(
      { login: user.login },
      { $set: { password: newPassword } },
    );
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
