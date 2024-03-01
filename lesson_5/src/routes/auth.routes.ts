import { Router, type Response, type Request } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { usersSchema } from "../schemas/users.schema";
import { checkSchema, validationResult } from "express-validator";
import { getFormattedErrors } from "../helpers";
import { authService } from "../domain/services/auth.service";

export const authRouter = Router({});

authRouter.route(ENDPOINTS.AUTH_LOGIN).post(
  checkSchema(
    {
      password: {
        customSanitizer: {
          options: (value: string) => {
            return value?.trim();
          },
        },
        errorMessage: "Wrong password",
        isString: true,
      },
      loginOrEmail: {
        customSanitizer: {
          options: (value: string) => {
            return value?.trim();
          },
        },
        errorMessage: "Wrong loginOrEmail",
        isString: true,
      },
    },
    ["body"]
  ),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
      const formattedErrors = getFormattedErrors(errors);

      return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
    }

    const { loginOrEmail, password } = req.body;

    const isSuccess = await authService.auth({ loginOrEmail, password });

    if (!isSuccess) {
      return res.sendStatus(HTTP_STATUS.NO_AUTH);
    }

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  }
);
