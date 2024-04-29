import { Collection } from "mongodb";
import type { SecurityInfo, Session } from "../../types";
import { client } from "../../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { ResultObject } from "../../common/helpers/result.helper";
import { COMMON_RESULT_STATUSES } from "../../common/types/common.types";

class SessionsCommandsRepository extends ResultObject {
  coll: Collection<SecurityInfo>;

  constructor() {
    super();
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.SESSIONS);
  }

  async addSession(session: Session) {
    await this.coll.updateOne(
      { userId: session.userId },
      {
        $push: {
          sessions: session,
        },
      },
      { upsert: true }
    );

    return this.getResult({
      data: true,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }
  //TODO: TRY
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
    await this.coll.findOneAndUpdate(
      {
        $and: [
          { userId },
          { "sessions.deviceId": deviceId },
          { "sessions.iat": currentIat },
        ],
      },
      {
        $set: {
          "sessions.$.iat": newIat,
          "sessions.$.exp": exp,
        },
      }
    );

    return this.getResult({
      data: true,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }
  //TODO
  async clearUserSessionsByDevice(
    userId: Session["userId"],
    deviceId: Session["deviceId"]
  ) {
    await this.coll.updateMany(
      { userId },
      { $pull: { sessions: { deviceId } } }
    );
  }
  //TODO
  async clearUserSessionsExceptCurrent(
    userId: Session["userId"],
    deviceId: Session["deviceId"],
    iat: Session["iat"]
  ) {
    await this.coll.updateMany(
      { userId },
      {
        $pull: { sessions: { deviceId, iat } },
      }
    );
  }
}

export const sessionsCommandsRepository = new SessionsCommandsRepository();
