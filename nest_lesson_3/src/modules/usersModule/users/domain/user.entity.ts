import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserInput } from '../models/users.dto';

@Schema()
export class EmailConfirmation {
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

@Schema({ timestamps: true })
export class User {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  createdAt: Date;

  @Prop()
  emailConfirmation?: EmailConfirmation;

  @Prop()
  passwordRecovery?: PasswordRecovery;

  static createUser(createUserInput: CreateUserInput): UserDocument {
    const user = new this();

    user.login = createUserInput.login;
    user.email = createUserInput.email;
    user.password = createUserInput.password;

    if (createUserInput?.emailConfirmation) {
      user.emailConfirmation = createUserInput.emailConfirmation;
    }

    return user as UserDocument;
  }

  getLogin() {
    return this.login;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

type UserModelStaticType = {
  createUser: (createUserInput: CreateUserInput) => UserDocument;
};

export type UserModelType = Model<UserDocument> & UserModelStaticType;
