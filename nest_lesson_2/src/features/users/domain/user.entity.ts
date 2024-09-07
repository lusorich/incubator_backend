import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: Date;

  @Prop()
  isConfirmed?: boolean;

  static createUser(login: string, email: string) {
    const user = new this();

    user.login = login;
    user.email = email;
    user.createdAt = new Date();
    user.isConfirmed = false;

    return user;
  }

  getLogin() {
    return this.login;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

type UserModelStaticType = {
  createUser: (login: string, email: string) => UserDocument;
};

export type UserModelType = Model<UserDocument> & UserModelStaticType;
