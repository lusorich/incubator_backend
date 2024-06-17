import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../constants";
import { jwtService } from "../services/jwt.service";
import { usersQueryRepository } from "../../repositories/query/users.query.repository";
import { requestsService } from "../../domain/services/requests.service";
import { requestsQueryRepository } from "../../repositories/query/requests.query.repository";
import { formatISO, parseISO } from "date-fns";
import { sessionQueryRepository } from "../../repositories/query/sessions.query.repository";
import { COMMON_RESULT_STATUSES } from "../types/common.types";

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

export const checkRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  const isValid = jwtService.isValid(refreshToken);

  if (!isValid) {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  const userId = jwtService.getIdFromToken(refreshToken);
  const deviceIdFromToken = jwtService.getDeviceIdFromToken(refreshToken);
  const iatFromToken = jwtService.getIatFromToken(refreshToken);

  const currentSession = await sessionQueryRepository.getSession(
    userId,
    deviceIdFromToken,
    iatFromToken || ""
  );

  if (currentSession.status === COMMON_RESULT_STATUSES.NOT_FOUND) {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  return next();
};
export const checkRequestCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = req.originalUrl;
  const ip = req.ip || "";
  const date = parseISO(new Date().toISOString());

  const rateRequests = await requestsQueryRepository.getRateRequests(
    ip,
    url,
    date
  );

  if (rateRequests.length >= 5) {
    return res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  await requestsService.addRequest(ip, url, date);

  return next();
};
