import { Router, type Response, type Request } from "express";
import { ENDPOINTS } from "../constants";

export const securityRouter = Router({});

securityRouter
  .route(ENDPOINTS.SECURITY_DEVICES)
  .get(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
  });
