import mongoose, { Model, model } from 'mongoose';

export interface UserInput {
  login: string;
  password: string;
  email: string;
}

export interface UserView {
  id: string;
  createdAt: Date;
  login: string;
  email: string;
}

export interface UserDb extends UserView {
  hash: string;
}

export type UserMakeInstanceProps = Omit<UserDb, 'createdAt' | 'id'>;

interface UserModel extends Model<UserDb> {
  makeInstance: ({ email, login, hash }: UserMakeInstanceProps) => void;
}

const userSchema = new mongoose.Schema<UserDb>({
  email: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  createdAt: {
    type: Date,
  },
  hash: {
    type: String,
  },
});

userSchema.static(
  'makeInstance',
  ({ email, login, hash }: UserModel['makeInstance']['arguments']) => {
    const user = new UserModel({ email, login, hash, createdAt: new Date() });

    return user;
  },
);

export const UserModel = model<UserDb, UserModel>('User', userSchema);
export type UserDocument = mongoose.HydratedDocument<UserDb>;
