import { HTTP_STATUS } from '../../../constants';
import { getFiltersFromQuery } from '../../../helpers';
import { UsersQueryRepository } from '../repositories/users.query.repository';
import { injectable } from 'inversify';

@injectable()
export class UsersController {
  private usersQueryRepository: UsersQueryRepository;

  constructor(usersQueryRepository: UsersQueryRepository) {
    this.usersQueryRepository = usersQueryRepository;
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
}
