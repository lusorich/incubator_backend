import { Router, type Response, type Request } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { usersSchema } from "../schemas/users.schema";
import { checkSchema, validationResult } from "express-validator";
import { getFormattedErrors } from "../helpers";
import { authService } from "../domain/services/auth.service";
import { authSchema } from "../schemas/auth.schema";
import { checkJwtAuth } from "../auth.middleware";
import { UserAuthView, UserView } from "../types";
import {
  UsersQueryRepository,
  usersQueryRepository,
} from "../repositories/query/users.query.repository";
import { jwtService } from "../common/services/jwt.service";

export const authRouter = Router({});

authRouter
  .route(ENDPOINTS.AUTH_LOGIN)
  .post(
    checkSchema(authSchema, ["body"]),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const { loginOrEmail, password } = req.body;

      const authResult = await authService.auth({ loginOrEmail, password });

      if (!authResult) {
        return res.sendStatus(HTTP_STATUS.NO_AUTH);
      }

      const token = jwtService.create(authResult.id);

      return res.status(HTTP_STATUS.SUCCESS).send(token);
    }
  );

authRouter
  .route(ENDPOINTS.AUTH_ME)
  .get(checkJwtAuth, async (req: Request, res: Response<UserAuthView>) => {
    const userIdFromRequest = req.userId;

    if (!userIdFromRequest) {
      return res.sendStatus(HTTP_STATUS.NO_AUTH);
    }

    const user = await usersQueryRepository.getUserById(userIdFromRequest);

    if (!user) {
      return res.sendStatus(HTTP_STATUS.NO_AUTH);
    }

    const { id: userId, email, login } = user;

    return res.status(HTTP_STATUS.SUCCESS).json({ userId, email, login });
  });
