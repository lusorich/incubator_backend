import { ResultObject } from "../../../common/helpers/result.helper";
import { COMMON_RESULT_STATUSES } from "../../../common/types/common.types";
import { LikeDb, LikeModel, LikeModelT } from "../domain/like.entity";

export class LikesCommandsRepository extends ResultObject {
  constructor(private model: LikeModelT = LikeModel) {
    super();
  }

  async updateLike({ parentId, userId, status }: LikeDb) {
    const found = await this.model.updateOne(
      {
        parentId,
        userId,
      },
      {
        parentId,
        userId,
        status,
      },
      { upsert: true }
    );

    if (found.acknowledged) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.SUCCESS,
      });
    } else {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.ERROR,
      });
    }
  }
}
