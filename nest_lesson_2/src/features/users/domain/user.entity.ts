import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
class EmailConfirmation {
  @Prop()
  code: string;

  @Prop()
  expire: Date;

  @Prop()
  isConfirmed: boolean;
}

@Schema()
class PasswordRecovery {
  @Prop()
  recoveryCode: string;

  @Prop()
  expire: Date;

  @Prop()
  isUsed: boolean;
}

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: Date;

  @Prop()
  emailConfirmation?: EmailConfirmation;

  @Prop()
  passwordRecovery?: PasswordRecovery;

  static createUser(login: string, email: string, emailConfirmation) {
    const user = new this();

    user.login = login;
    user.email = email;
    user.createdAt = new Date();

    if (emailConfirmation) {
      user.emailConfirmation = emailConfirmation;
    }

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
  createUser: (
    login: string,
    email: string,
    emailConfirmation?: EmailConfirmation,
    passwordRecoveryConfirmation?: PasswordRecovery,
  ) => UserDocument;
};

export type UserModelType = Model<UserDocument> & UserModelStaticType;
