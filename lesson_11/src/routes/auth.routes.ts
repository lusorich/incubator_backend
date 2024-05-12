import { Router, type Response, type Request } from "express";
import { ENDPOINTS, HTTP_STATUS, SETTINGS } from "../constants";
import {
  emailValidator,
  passwordValidator,
  usersSchema,
} from "../schemas/users.schema";
import { checkSchema, validationResult } from "express-validator";
import { getFormattedErrors } from "../helpers";
import { authService } from "../domain/services/auth.service";
import { authSchema } from "../schemas/auth.schema";
import {
  checkJwtAuth,
  checkRefreshToken,
  checkRequestCount,
} from "../common/middlewares/auth.middleware";
import { UserAuthView } from "../types";
import { usersQueryRepository } from "../features/users/repositories/users.query.repository";
import { jwtService } from "../common/services/jwt.service";
import { EmailService } from "../common/services/email.service";
import { usersService } from "../features/users/application/users.service";
import { usersCommandsRepository } from "../features/users/repositories/users.commands.repository";
import { COMMON_RESULT_STATUSES } from "../common/types/common.types";
import { sessionsService } from "../domain/services/sessions.service";
import { randomUUID } from "crypto";
import { sessionQueryRepository } from "../repositories/query/sessions.query.repository";
import { formatISO, fromUnixTime } from "date-fns";
import { ObjectId } from "mongodb";

export const authRouter = Router({});

authRouter
  .route(ENDPOINTS.AUTH_LOGIN)
  .post(
    checkRequestCount,
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

      const deviceId = randomUUID();
      // 10s
      const accessToken = jwtService.create(authResult._id.toString(), "10s");
      // 20s
      const refreshToken = jwtService.create(
        authResult._id.toString(),
        "20s",
        deviceId
      );

      const iat = jwtService.getIatFromToken(refreshToken);
      const exp = jwtService.getExpFromToken(refreshToken);

      await sessionsService.addSession({
        userId: authResult._id.toString(),
        deviceId,
        iat: iat || "",
        exp: exp || "",
        deviceName: req.get("User-Agent") ?? "unknown",
        ip: req.ip ?? "",
      });

      return res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(HTTP_STATUS.SUCCESS)
        .json({ accessToken });
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
    checkRequestCount,
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
          {
            errorsMessages: [],
          };

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
  .post(checkRequestCount, async (req: Request, res: Response) => {
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

authRouter.route(ENDPOINTS.REGISTRATION_EMAIL_RESENDING).post(
  checkRequestCount,
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

authRouter
  .route(ENDPOINTS.AUTH_REFRESH_TOKEN)
  .post(checkRefreshToken, async (req: Request, res: Response) => {
    const prevRefreshToken = req.cookies.refreshToken;

    const userId = jwtService.getIdFromToken(prevRefreshToken);
    const deviceId = jwtService.getDeviceIdFromToken(prevRefreshToken);

    if (userId) {
      try {
        await usersQueryRepository.getUserById(userId);
      } catch (e) {
        return res.sendStatus(HTTP_STATUS.NO_AUTH);
      }
    } else {
      return res.sendStatus(HTTP_STATUS.NO_AUTH);
    }
    // 10s
    const accessToken = jwtService.create(userId, "10s");
    // 20s
    const refreshToken = jwtService.create(userId, "20s", deviceId);

    await sessionsService.updateSession({
      userId,
      deviceId,
      currentIat: jwtService.getIatFromToken(prevRefreshToken) ?? "",
      newIat: jwtService.getIatFromToken(refreshToken) ?? "",
      exp: jwtService.getExpFromToken(refreshToken) ?? "",
    });

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(HTTP_STATUS.SUCCESS)
      .json({ accessToken });
  });

authRouter
  .route(ENDPOINTS.AUTH_LOGOUT)
  .post(checkRefreshToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const userId = jwtService.getIdFromToken(refreshToken);
    const deviceId = jwtService.getDeviceIdFromToken(refreshToken);

    await sessionsService.clearUserSessionsByDevice(userId, deviceId);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

authRouter
  .route(ENDPOINTS.AUTH_PASSWORD_RECOVERY)
  .post(
    checkRequestCount,
    checkSchema({ email: emailValidator }, ["body"]),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const emailService = new EmailService();
      const emailConfirmationInfo =
        emailService.generatePasswordRecoveryConfirmation();
      const emailTemplate = emailService.generateRecoveryPasswordEmail({
        recoveryCode: emailConfirmationInfo.recoveryCode,
      });

      const found = await usersQueryRepository.findUserByEmail(req.body?.email);

      if (found) {
        await usersCommandsRepository.updateEmailRecoveryPasswordConfirmation(
          found._id,
          emailConfirmationInfo
        );
      }

      try {
        await emailService.sendEmail({
          from: "eeugern@mail.ru",
          to: req.body.email,
          html: emailTemplate,
        });
      } catch (e) {
        console.error("e");
      }

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  );

authRouter
  .route(ENDPOINTS.AUTH_NEW_PASSWORD)
  .post(
    checkRequestCount,
    checkSchema({ newPassword: passwordValidator }, ["body"]),
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      const recoveryCode = req.body?.recoveryCode || null;
      const newPassword = req.body.newPassword || null;

      if (errors.length) {
        const formattedErrors = getFormattedErrors(errors);

        return res.status(HTTP_STATUS.INCORRECT).json(formattedErrors);
      }

      const found = await usersQueryRepository.findUserByRecoveryCode(
        recoveryCode
      );

      if (!found) {
        return res.status(HTTP_STATUS.INCORRECT).json({
          errorsMessages: [
            { message: "Wrong recovery code", field: "recoveryCode" },
          ],
        });
      }

      // if (found.emailConfirmation?.isConfirmed) {
      //   return res.status(HTTP_STATUS.INCORRECT).json({
      //     errorsMessages: [{ message: "Wrong code", field: "code" }],
      //   })
      // }

      await usersService.updateUserPassword(found, newPassword);

      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    }
  );
