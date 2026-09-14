import * as bcrypt from "bcrypt";
import { usersQueryRepository } from "../../repositories/query/users.query.repository";
import { cryptService } from "../../common/services/crypt.service";
import { WithId } from "mongodb";
import { UserDb } from "../../types";
import { authCommandsRepository } from "../../repositories/commands/auth.commands.repository";
//TODO: сервис не должен обращаться к квери репозиторию

// единый интерфейс для AuthService, но разная зависимость для сервиса

export interface IAuthService {
  auth: ({
    loginOrEmail,
    password,
  }: {
    loginOrEmail: string;
    password: string;
  }) => Promise<WithId<UserDb> | boolean>;

  authWithEmail: ({
    password,
    email,
  }: {
    password: string;
    email: string;
  }) => Promise<WithId<UserDb> | boolean>;

  authWithLogin: ({
    password,
    login,
  }: {
    password: string;
    login: string;
  }) => Promise<WithId<UserDb> | boolean>;

  addTokenToBlacklist: (userId: string, token: string) => Promise<any>;
}
export class AuthService implements IAuthService {
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
      const result = await this.authWithEmail({
        email: loginOrEmail,
        password,
      });

      return result;
    } else {
      const result = await this.authWithLogin({
        login: loginOrEmail,
        password,
      });

      return result;
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

    const isHashValid = await cryptService.isValid({
      password,
      hash: found.hash,
    });

    if (!isHashValid) {
      return false;
    }

    return found;
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

    const isHashValid = await cryptService.isValid({
      password,
      hash: found.hash,
    });

    if (!isHashValid) {
      return false;
    }

    return found;
  }

  async addTokenToBlacklist(userId: string, token: string) {
    return await authCommandsRepository.addTokenToBlacklist(userId, token);
  }
}

export const authService = new AuthService();
