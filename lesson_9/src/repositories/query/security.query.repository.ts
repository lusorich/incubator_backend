import { Collection, WithId } from "mongodb";
import { ResultObject } from "../../common/helpers/result.helper";
import { client } from "../../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { SecurityDeviceView, SecurityDevices } from "../../types";
import { COMMON_RESULT_STATUSES } from "../../common/types/common.types";

export class SecurityQueryRepository extends ResultObject {
  coll: Collection<SecurityDevices>;

  constructor() {
    super();
    this.coll = client
      .db(MONGO_DB_NAME)
      .collection(MONGO_COLLECTIONS.SECURITY_DEVICES);
  }

  async getSecurityDevices(userId: SecurityDevices["userId"]) {
    const securityDevices = await this.coll
      .find({
        userId,
      })
      .toArray();

    return this.getResult<SecurityDeviceView[]>({
      data: this._mapToSecurityDevicesViewModel(securityDevices),
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  _mapToSecurityDevicesViewModel(
    securityDevices: WithId<SecurityDevices>[]
  ): SecurityDeviceView[] {
    if (!securityDevices.length) {
      return [];
    }

    const securityDevicesView = securityDevices.map(
      ({ ip, deviceName, iat, deviceId }) => ({
        ip,
        title: deviceName,
        lastActiveDate: iat,
        deviceId,
      })
    );

    return securityDevicesView;
  }
}

export const securityQueryRepository = new SecurityQueryRepository();
