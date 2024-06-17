import { Collection } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { client } from "../../db/db";
import { Blacklist } from "../../types";
import { ResultObject } from "../../common/helpers/result.helper";

export class AuthCommandsRepository extends ResultObject {
  coll: Collection<Blacklist>;

  constructor() {
    super();
    this.coll = client
      .db(MONGO_DB_NAME)
      .collection(MONGO_COLLECTIONS.BLACKLIST);
  }

  async addTokenToBlacklist(userId: string, token: string) {
    const res = await this.coll.updateOne(
      { userId },
      {
        $push: {
          tokens: token,
        },
      },
      { upsert: true }
    );

    return res;
  }

  async clearBlacklist() {
    await this.coll.deleteMany({});

    return this;
  }
}

export const authCommandsRepository = new AuthCommandsRepository();
