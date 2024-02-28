import {
  IUsersCommandsRepository,
  usersCommandsRepository,
} from "../../repositories/commands/users.commands.repository";
import { User, UserWithId } from "../../types";

export class UsersService {
  usersCommandsRepository: IUsersCommandsRepository;

  constructor() {
    this.usersCommandsRepository = usersCommandsRepository;
  }

  async addUser(user: User) {
    const newUser: UserWithId = {
      ...user,
      createdAt: new Date(),
      id: String(Math.round(Math.random() * 1000)),
    };

    return await this.usersCommandsRepository.addUser(newUser);
  }

  async deleteUserById(id: UserWithId["id"]) {
    return await this.usersCommandsRepository.deleteUserById(id);
  }

  async clearUsers() {}
}

export const usersService = new UsersService();
