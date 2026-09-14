import { ResultObject } from '../../../common/helpers/result.helper';
import { COMMON_RESULT_STATUSES } from '../../../common/types/common.types';
import { LikeDb, LikeModel, LikeModelT } from '../domain/like.entity';

export class LikesQueryRepository extends ResultObject {
  constructor(private model: LikeModelT = LikeModel) {
    super();
  }

  async getLikesByParentId(parentId: LikeDb['parentId']) {
    const result = await this.model.find({ parentId }).sort({ addedAt: -1 });

    return result;
  }

  async getLikesByParentAndUserId(
    parentId: LikeDb['parentId'],
    userId: LikeDb['userId'],
  ) {
    const result = await this.model
      .findOne({ parentId, userId })
      .sort({ addedAt: -1 });

    return result;
  }
}
