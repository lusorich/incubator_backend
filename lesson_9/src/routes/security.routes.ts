import { Router, type Response, type Request } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { jwtService } from "../common/services/jwt.service";
import { sessionQueryRepository } from "../repositories/query/sessions.query.repository";

export const securityRouter = Router({});

securityRouter
  .route(ENDPOINTS.SECURITY_DEVICES)
  .get(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const isValid = jwtService.isValid(refreshToken);

    if (!isValid) {
      return res.sendStatus(HTTP_STATUS.NO_AUTH);
    }

    const userIdFromToken = jwtService.getIdFromToken(refreshToken);
    const sessions = await sessionQueryRepository.getSessions(userIdFromToken);

    return res.json(sessions.data);
  });
