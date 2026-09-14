import { ResultObject } from "../../../common/helpers/result.helper";

import { addSeconds, formatISO, parseISO } from "date-fns";
import { RateRequest, RequestModel } from "../domain/request.entity";

export class RequestsQueryRepository extends ResultObject {
  model: typeof RequestModel;

  constructor() {
    super();
    this.model = RequestModel;
  }
  async getRateRequests(
    ip: RateRequest["ip"],
    url: RateRequest["url"],
    date: RateRequest["date"]
  ) {
    const requests = await this.model.find({
      $and: [
        { ip },
        { url },
        {
          date: {
            $gte: parseISO(formatISO(addSeconds(date, -10))),
          },
        },
      ],
    });

    return requests;
  }
}

export const requestsQueryRepository = new RequestsQueryRepository();
