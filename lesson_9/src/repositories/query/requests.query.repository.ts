import { Collection, WithId } from "mongodb";
import { ResultObject } from "../../common/helpers/result.helper";
import { client } from "../../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { RateRequest, SecurityInfo, Session, SessionView } from "../../types";
import { COMMON_RESULT_STATUSES } from "../../common/types/common.types";
import { addSeconds, formatISO, parseISO } from "date-fns";

export class RequestsQueryRepository extends ResultObject {
  coll: Collection<SecurityInfo>;

  constructor() {
    super();
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.REQUESTS);
  }
  async getRateRequests(
    ip: RateRequest["ip"],
    url: RateRequest["url"],
    date: RateRequest["date"]
  ) {
    const requests = await this.coll
      .find({
        $and: [
          { ip },
          { url },
          {
            date: {
              $gte: parseISO(formatISO(addSeconds(date, -10))),
            },
          },
        ],
      })
      .toArray();

    return requests;
  }
}

export const requestsQueryRepository = new RequestsQueryRepository();
