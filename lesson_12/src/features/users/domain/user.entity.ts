import mongoose, { Model, model } from "mongoose";
import { UserDb } from "../../../types";

export interface UserViewWithId extends UserView {
  id?: string;
}
export interface UserView {
  login: string;
  email: string;
  createdAt: Date;
}

type UserModel = Model<UserDb>;

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

export const UserModel = model<UserDb, UserModel>("User", userSchema);
export type UserDocument = mongoose.HydratedDocument<UserDb>;
