import { Collection } from "mongodb";
import type { RateRequest, SecurityInfo, Session } from "../../types";
import { client } from "../../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { ResultObject } from "../../common/helpers/result.helper";
import { COMMON_RESULT_STATUSES } from "../../common/types/common.types";

class RequestsCommandsRepository extends ResultObject {
  coll: Collection<RateRequest>;

  constructor() {
    super();
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.REQUESTS);
  }

  async addRequest(
    ip: RateRequest["ip"],
    url: RateRequest["url"],
    date: RateRequest["date"]
  ) {
    await this.coll.insertOne({ ip, url, date });

    return this.getResult({
      data: true,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }
}

export const requestsCommandsRepository = new RequestsCommandsRepository();
