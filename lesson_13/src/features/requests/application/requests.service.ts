import { RateRequest } from "../domain/request.entity";
import { requestsCommandsRepository } from "../repositories/requests.commands.repository";

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
