import { Router, type Response, type Request } from 'express';
import { ENDPOINTS, HTTP_STATUS } from '../constants';
import { getFiltersFromQuery, getFormattedErrors } from '../helpers';
import { usersQueryRepository } from '../features/users/repositories/users.query.repository';
import { checkSchema, validationResult } from 'express-validator';
import { usersSchema } from '../schemas/users.schema';
import { usersService } from '../features/users/application/users.service';
import { UsersController } from '../features/users/controller/users.controller';
import { container } from '../common/helpers/inversify.container';

export const usersRouter = Router({});

const usersController = container.resolve(UsersController);

usersRouter
  .route(ENDPOINTS.USERS)
  .get(usersController.getUsers.bind(usersController))
  .post(
    checkSchema(usersSchema, ['body']),
    usersController.addUser.bind(usersController),
  );

usersRouter
  .route(ENDPOINTS.USERS_ID)
  .delete(async (req: Request, res: Response) => {
    const found = await usersQueryRepository.getUserById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await usersService.deleteUserById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
