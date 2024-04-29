import { sessionsCommandsRepository } from "../../repositories/commands/sessions.commands.repository";
import type { Session } from "../../types";

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
}

export const sessionsService = new SessionsService();
