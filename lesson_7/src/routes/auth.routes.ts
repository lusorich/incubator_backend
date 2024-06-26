import { Router, type Response, type Request } from "express";
import { ENDPOINTS, HTTP_STATUS, SETTINGS } from "../constants";
import { emailValidator, usersSchema } from "../schemas/users.schema";
import { checkSchema, validationResult } from "express-validator";
import { getFormattedErrors } from "../helpers";
import { authService } from "../domain/services/auth.service";
import { authSchema } from "../schemas/auth.schema";
import { checkJwtAuth } from "../auth.middleware";
import { UserAuthView } from "../types";
import {
  UsersQueryRepository,
  usersQueryRepository,
} from "../repositories/query/users.query.repository";
import { jwtService } from "../common/services/jwt.service";
import nodemailer from "nodemailer";
import { EmailService } from "../common/services/email.service";
import { usersService } from "../domain/services/users.service";
import { isAfter } from "date-fns";
import { usersCommandsRepository } from "../repositories/commands/users.commands.repository";

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

      const accessToken = jwtService.create(authResult._id.toString());

      return res.status(HTTP_STATUS.SUCCESS).json({ accessToken });
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

authRouter
  .route(ENDPOINTS.REGISTRATION)
  .post(
    checkSchema(usersSchema, ["body"]),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const isUserWithUsernameExist =
        await usersQueryRepository.findUserByLogin(req.body?.login);
      const isUserWithEmailExist = await usersQueryRepository.findUserByEmail(
        req.body?.email
      );

      if (isUserWithUsernameExist || isUserWithEmailExist) {
        const errors: { errorsMessages: { field: string; message: string }[] } =
          { errorsMessages: [] };

        if (isUserWithEmailExist) {
          errors.errorsMessages.push({
            field: "email",
            message: "Wrong Email",
          });
        }

        if (isUserWithUsernameExist) {
          errors.errorsMessages.push({
            field: "login",
            message: "Wrong Login",
          });
        }

        return res.status(HTTP_STATUS.INCORRECT).json(errors);
      }

      const emailService = new EmailService();
      const emailConfirmationInfo = emailService.generateEmailConfirmation();
      const emailTemplate = emailService.generateEmailTemplate({
        code: emailConfirmationInfo.confirmationCode,
      });

      const user = await usersService.addUser(req.body, emailConfirmationInfo);
      await emailService.sendEmail({
        from: "eeugern@mail.ru",
        to: user?.email ?? "",
        html: emailTemplate,
      });

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  );

authRouter
  .route(ENDPOINTS.REGISTRATION_CONFIRMATION)
  .post(async (req: Request, res: Response) => {
    const code = req.params?.code || req.body?.code || null;

    if (!code) {
      return res
        .status(HTTP_STATUS.INCORRECT)
        .json({ errorsMessages: [{ message: "Wrong code", field: "code" }] });
    }

    const found = await usersQueryRepository.findUserByConfirmationCode(code);

    if (!found) {
      return res
        .status(HTTP_STATUS.INCORRECT)
        .json({ errorsMessages: [{ message: "Wrong code", field: "code" }] });
    }

    if (found.emailConfirmation?.isConfirmed) {
      return res.status(HTTP_STATUS.INCORRECT).json({
        errorsMessages: [{ message: "Wrong code", field: "code" }],
      });
    }

    await usersCommandsRepository.setUserIsConfirmed(found._id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

authRouter
  .route(ENDPOINTS.REGISTRATION_EMAIL_RESENDING)
  .post(
    checkSchema({ email: emailValidator }, ["body"]),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      const found = await usersQueryRepository.findUserByEmail(req.body?.email);

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      if (!found || found?.emailConfirmation?.isConfirmed) {
        return res.status(HTTP_STATUS.INCORRECT).json({
          errorsMessages: [{ message: "Wrong email", field: "email" }],
        });
      }

      const emailService = new EmailService();
      const emailConfirmationInfo = emailService.generateEmailConfirmation();
      const emailTemplate = emailService.generateEmailTemplate({
        code: emailConfirmationInfo.confirmationCode,
      });

      await usersCommandsRepository.updateEmailConfirmation(
        found._id,
        emailConfirmationInfo
      );

      await emailService.sendEmail({
        from: "eeugern@mail.ru",
        to: req.body.email,
        html: emailTemplate,
      });

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  );
