import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "./constants";
import { jwtService } from "./common/services/jwt.service";
import { usersService } from "./domain/services/users.service";
import { usersQueryRepository } from "./repositories/query/users.query.repository";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization !== "Basic YWRtaW46cXdlcnR5"
  ) {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  return next();
};

export const checkJwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  const token = req.headers.authorization.split(" ")[1];

  const id = jwtService.getIdFromToken(token);
  const isValid = jwtService.isValid(token);

  if (!isValid) {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  if (id) {
    try {
      const user = await usersQueryRepository.getUserById(id);

      req.userId = user ? user.id : null;
    } catch (e) {
      return res.sendStatus(HTTP_STATUS.NO_AUTH);
    }
  } else {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  return next();
};
