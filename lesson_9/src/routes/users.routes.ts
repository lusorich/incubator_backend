import { Router, type Response, type Request } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { getFiltersFromQuery, getFormattedErrors } from "../helpers";
import { usersQueryRepository } from "../repositories/query/users.query.repository";
import { checkSchema, validationResult } from "express-validator";
import { usersSchema } from "../schemas/users.schema";
import { usersService } from "../domain/services/users.service";
import { checkAuth } from "../common/middlewares/auth.middleware";

export const usersRouter = Router({});

usersRouter
  .route(ENDPOINTS.USERS)
  .get(checkAuth, async (req: Request, res: Response) => {
    const {
      sortBy,
      sortDirection,
      pagination,
      searchEmailTerm,
      searchLoginTerm,
    } = getFiltersFromQuery(req.query);

    const users = await usersQueryRepository.getAllUsers({
      pagination,
      sortDirection,
      sortBy,
      searchEmailTerm,
      searchLoginTerm,
    });

    res.status(HTTP_STATUS.SUCCESS).json(users);
  })
  .post(
    checkAuth,
    checkSchema(usersSchema, ["body"]),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const newUser = await usersService.addUser(req.body);

      return res.status(HTTP_STATUS.CREATED).json(newUser || undefined);
    }
  );

usersRouter
  .route(ENDPOINTS.USERS_ID)
  .delete(checkAuth, async (req: Request, res: Response) => {
    const found = await usersQueryRepository.getUserById(req.params.id);

    if (!found) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    await usersService.deleteUserById(req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
