import { Router, type Response, type Request } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { jwtService } from "../common/services/jwt.service";
import { sessionQueryRepository } from "../repositories/query/sessions.query.repository";
import { checkRefreshToken } from "../common/middlewares/auth.middleware";
import { sessionsService } from "../domain/services/sessions.service";
import { COMMON_RESULT_STATUSES } from "../common/types/common.types";

export const securityRouter = Router({});

securityRouter
  .route(ENDPOINTS.SECURITY_DEVICES)
  .get(checkRefreshToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const userIdFromToken = jwtService.getIdFromToken(refreshToken);

    const sessions = await sessionQueryRepository.getSessions(userIdFromToken);

    return res.json(sessions.data);
  })
  .delete(checkRefreshToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const userIdFromToken = jwtService.getIdFromToken(refreshToken);
    const deviceIdFromToken = jwtService.getDeviceIdFromToken(refreshToken);
    const iatFromToken = jwtService.getIatFromToken(refreshToken);

    await sessionsService.clearUserSessionsExceptCurrent(
      userIdFromToken,
      deviceIdFromToken,
      iatFromToken || ""
    );

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

securityRouter
  .route(ENDPOINTS.SECURITY_DEVICE_BY_DEVICE_ID)
  .delete(checkRefreshToken, async (req: Request, res: Response) => {
    const { id: deviceId } = req.params;
    const refreshToken = req.cookies.refreshToken;

    const userId = jwtService.getIdFromToken(refreshToken);

    const securityInfoByDeviceId =
      await sessionQueryRepository.getSessionByDeviceId(deviceId);

    if (
      !deviceId ||
      securityInfoByDeviceId.status === COMMON_RESULT_STATUSES.NOT_FOUND
    ) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    if (securityInfoByDeviceId.data?.userId !== userId) {
      return res.sendStatus(HTTP_STATUS.INCORRECT_OWNER);
    }

    await sessionsService.clearUserSessionsByDevice(userId, deviceId);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
