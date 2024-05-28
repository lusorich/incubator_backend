import { ResultObject } from "../../../common/helpers/result.helper";
import { COMMON_RESULT_STATUSES } from "../../../common/types/common.types";
import { RateRequest, RequestModel } from "../domain/request.entity";

class RequestsCommandsRepository extends ResultObject {
  model: typeof RequestModel;

  constructor() {
    super();
    this.model = RequestModel;
  }

  async addRequest(
    ip: RateRequest["ip"],
    url: RateRequest["url"],
    date: RateRequest["date"]
  ) {
    await this.model.create({ ip, url, date });

    return this.getResult({
      data: true,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }
}

export const requestsCommandsRepository = new RequestsCommandsRepository();
