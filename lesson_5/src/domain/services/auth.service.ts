import * as bcrypt from "bcrypt";
import { usersQueryRepository } from "../../repositories/query/users.query.repository";
import { cryptService } from "./crypt.service";

export class AuthService {
  async auth({
    loginOrEmail,
    password,
  }: {
    loginOrEmail: string;
    password: string;
  }) {
    const isEmail = loginOrEmail?.match(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    )?.length;

    if (isEmail) {
      const isSuccess = await this.authWithEmail({
        email: loginOrEmail,
        password,
      });

      return isSuccess;
    } else {
      const isSuccess = await this.authWithLogin({
        login: loginOrEmail,
        password,
      });

      return isSuccess;
    }
  }

  async authWithEmail({
    email,
    password,
  }: {
    password: string;
    email: string;
  }) {
    const found = await usersQueryRepository.findUserByEmail(email);

    if (!found) {
      return false;
    }

    return await cryptService.isHashValid({
      password,
      hash: found.hash,
    });
  }

  async authWithLogin({
    login,
    password,
  }: {
    password: string;
    login: string;
  }) {
    const found = await usersQueryRepository.findUserByLogin(login);

    if (!found) {
      return false;
    }

    return await cryptService.isHashValid({
      password,
      hash: found.hash,
    });
  }
}

export const authService = new AuthService();
