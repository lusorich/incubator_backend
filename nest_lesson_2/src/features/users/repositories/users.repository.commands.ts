import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';

@Injectable()
export class UsersCommandsRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async create(login: string, email: string, emailConfirmation) {
    const user: UserDocument = this.UserModel.createUser(
      login,
      email,
      emailConfirmation,
    );

    return this.save(user);
  }

  async save(user: UserDocument) {
    return user.save();
  }

  async delete(id: number) {
    return this.UserModel.deleteOne({ _id: id });
  }

  async deleteAll() {
    return this.UserModel.deleteMany({});
  }
}
