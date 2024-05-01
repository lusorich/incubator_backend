import { requestsCommandsRepository } from "../../repositories/commands/requests.commands.repository";
import { sessionsCommandsRepository } from "../../repositories/commands/sessions.commands.repository";
import type { RateRequest, Session } from "../../types";

class RequestsService {
  async addRequest(
    ip: RateRequest["ip"],
    url: RateRequest["url"],
    date: RateRequest["date"]
  ) {
    return await requestsCommandsRepository.addRequest(ip, url, date);
  }
}

export const requestsService = new RequestsService();
