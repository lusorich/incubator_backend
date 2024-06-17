import {
  IUsersCommandsRepository,
  usersCommandsRepository,
} from "../repositories/users.commands.repository";
import { UserDb, UserEmailConfirmation } from "../../../types";
import { cryptService } from "../../../common/services/crypt.service";
import { WithId } from "mongodb";
import { UserViewWithId } from "../domain/user.entity";

export class UsersService {
  usersCommandsRepository: IUsersCommandsRepository;

  constructor() {
    this.usersCommandsRepository = usersCommandsRepository;
  }

  async addUser(
    user: Omit<UserDb & { password: string }, "id">,
    emailConfirmationInfo?: UserEmailConfirmation
  ) {
    const salt = await cryptService.getSalt();
    const userHash = await cryptService.getHash({
      password: user.password || "",
      salt,
    });

    const newUser: UserDb = {
      login: user.login,
      email: user.email,
      hash: userHash,
      createdAt: new Date(),
      emailConfirmation: emailConfirmationInfo,
    };

    return await this.usersCommandsRepository.addUser(newUser);
  }

  async updateUserPassword(user: WithId<UserDb>, newPassword: string) {
    const salt = await cryptService.getSalt();
    const userHash = await cryptService.getHash({
      password: newPassword || "",
      salt,
    });

    return await this.usersCommandsRepository.updateUserPassword(
      user._id,
      userHash
    );
  }

  async deleteUserById(id: UserViewWithId["id"]) {
    return await this.usersCommandsRepository.deleteUserById(id);
  }

  async clearUsers() {}
}

export const usersService = new UsersService();
