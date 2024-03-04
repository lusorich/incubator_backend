import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "./constants";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization !== "Basic YWRtaW46cXdlcnR5"
  ) {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  return next();
};
