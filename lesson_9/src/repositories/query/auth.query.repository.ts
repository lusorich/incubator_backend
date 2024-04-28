import { Collection } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { client } from "../../db/db";
import { Blacklist } from "../../types";

import { ResultObject } from "../../common/helpers/result.helper";
import { COMMON_RESULT_STATUSES } from "../../common/types/common.types";

export class AuthQueryRepository extends ResultObject {
  coll: Collection<Blacklist>;

  constructor() {
    super();
    this.coll = client
      .db(MONGO_DB_NAME)
      .collection(MONGO_COLLECTIONS.BLACKLIST);
  }

  async getBlacklist() {
    const blacklist = await this.coll.find({}).toArray();

    return this.getResult({
      data: blacklist,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }
  async getIsTokenInBlacklist(userId: string, token: string) {
    const found = await this.coll.findOne({
      userId,
    });

    if (!found || !found.tokens.includes(token)) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
      });
    }

    return this.getResult({
      data: found,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }
}

export const authQueryRepository = new AuthQueryRepository();
