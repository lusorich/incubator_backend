import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../../../constants';
import { getFiltersFromQuery, getFormattedErrors } from '../../../helpers';
import { UsersQueryRepository } from '../repositories/users.query.repository';
import { injectable } from 'inversify';
import { UsersService } from '../application/users.service';

@injectable()
export class UsersController {
  private usersQueryRepository: UsersQueryRepository;
  private usersService: UsersService;

  constructor(
    usersQueryRepository: UsersQueryRepository,
    usersService: UsersService,
  ) {
    this.usersQueryRepository = usersQueryRepository;
    this.usersService = usersService;
  }

  async getUsers(req, res) {
    const {
      sortBy,
      sortDirection,
      pagination,
      searchEmailTerm,
      searchLoginTerm,
    } = getFiltersFromQuery(req.query);

    const users = await this.usersQueryRepository.getAllUsers({
      pagination,
      sortDirection,
      sortBy,
      searchEmailTerm,
      searchLoginTerm,
    });

    res.status(HTTP_STATUS.SUCCESS).json(users);
  }

  async addUser(req, res) {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
      const formattedErrors = getFormattedErrors(errors);

      return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
    }

    const newUser = await this.usersService.addUser(req.body);

    return res.status(HTTP_STATUS.CREATED).json(newUser || undefined);
  }

  async deleteUser(req, res) {
    const found = await this.usersQueryRepository.getUserById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await this.usersService.deleteUserById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  }
}
