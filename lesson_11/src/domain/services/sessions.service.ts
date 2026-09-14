import { sessionsCommandsRepository } from "../../repositories/commands/sessions.commands.repository";
import type { RateRequest, Session } from "../../types";

class SessionsService {
  async addSession(session: Session) {
    return await sessionsCommandsRepository.addSession(session);
  }

  async updateSession({
    userId,
    deviceId,
    currentIat,
    newIat,
    exp,
  }: {
    userId: Session["userId"];
    deviceId: Session["deviceId"];
    currentIat: Session["iat"];
    newIat: Session["iat"];
    exp: Session["exp"];
  }) {
    return await sessionsCommandsRepository.updateSession({
      userId,
      deviceId,
      currentIat,
      newIat,
      exp,
    });
  }

  async clearUserSessionsByDevice(
    userId: Session["userId"],
    deviceId: Session["deviceId"]
  ) {
    return await sessionsCommandsRepository.clearUserSessionsByDevice(
      userId,
      deviceId
    );
  }

  async clearUserSessionsExceptCurrent(
    userId: Session["userId"],
    deviceId: Session["deviceId"],
    iat: Session["iat"]
  ) {
    return await sessionsCommandsRepository.clearUserSessionsExceptCurrent(
      userId,
      deviceId,
      iat
    );
  }

  async clearSessions() {
    await sessionsCommandsRepository.clearSessions();

    return this;
  }
}

export const sessionsService = new SessionsService();
