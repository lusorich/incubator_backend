import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { CreateUserInput } from '../models/users.dto';

@Injectable()
export class UsersCommandsRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async create(createUserInput: CreateUserInput) {
    const user: UserDocument = this.UserModel.createUser(createUserInput);

    return this.save(user);
  }

  async save(user: UserDocument) {
    return user.save();
  }

  async updateUserIsConfirmed(user, isConfirmed) {
    return this.UserModel.updateOne(
      { login: user.login },
      {
        $set: { 'emailConfirmation.isConfirmed': isConfirmed },
      },
    );
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
