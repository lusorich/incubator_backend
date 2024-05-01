import { Collection, WithId } from "mongodb";
import { ResultObject } from "../../common/helpers/result.helper";
import { client } from "../../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { RateRequest, SecurityInfo, Session, SessionView } from "../../types";
import { COMMON_RESULT_STATUSES } from "../../common/types/common.types";
import { isEqual } from "date-fns";

export class SessionsQueryRepository extends ResultObject {
  coll: Collection<SecurityInfo>;

  constructor() {
    super();
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.SESSIONS);
  }

  async getSessions(userId: Session["userId"]) {
    const securityInfo = await this.coll.findOne({
      userId,
    });

    return this.getResult<SessionView[]>({
      data: this._mapToSessionViewModel(securityInfo?.sessions ?? []),
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  async getSession(
    userId: Session["userId"],
    deviceId: Session["deviceId"],
    iat: Session["iat"]
  ) {
    const securityInfo = await this.coll.findOne({
      $and: [
        { userId },
        { "sessions.deviceId": deviceId },
        { "sessions.iat": iat },
      ],
    });

    if (!securityInfo?.sessions.length) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
      });
    }

    const equalTimeSessions = securityInfo?.sessions?.filter((session) =>
      isEqual(session?.iat, iat)
    );

    if (!equalTimeSessions?.length) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
      });
    }

    return this.getResult({
      data: null,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  async getSessionByDeviceId(deviceId: Session["deviceId"]) {
    const securityInfo = await this.coll.findOne({
      "sessions.deviceId": deviceId,
    });

    if (!securityInfo?.sessions.length) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
      });
    }

    return this.getResult<SecurityInfo>({
      data: securityInfo,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  _mapToSessionViewModel(sessions: Session[]): SessionView[] {
    if (!sessions.length) {
      return [];
    }

    const sessionsView = sessions.map(({ ip, deviceName, iat, deviceId }) => ({
      ip,
      title: deviceName,
      lastActiveDate: iat,
      deviceId,
    }));

    return sessionsView;
  }
}

export const sessionQueryRepository = new SessionsQueryRepository();
