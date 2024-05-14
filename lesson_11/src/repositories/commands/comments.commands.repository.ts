import { Collection, ObjectId, WithId } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { client } from "../../db/db";
import { CommentDb, CommentView } from "../../types";
import { commentsQueryRepository } from "../query/comments.query.repository";
import { likesService } from "../../features/likes/application/likes.service";
import { LikesQueryRepository } from "../../features/likes/repositories/likes.query.repository";
import { LIKE_STATUS, LikeDb } from "../../features/likes/domain/like.entity";

export class CommentsCommandsRepository {
  coll: Collection<CommentDb>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.COMMENTS);
  }

  async addComment(newComment: CommentDb) {
    await this.coll.insertOne(newComment);

    return commentsQueryRepository._mapToCommentViewModel(
      newComment as WithId<CommentDb>
    );
  }

  async deleteCommentById(id: CommentView["id"]) {
    const found = await this.coll.deleteOne({ _id: new ObjectId(id) });

    if (!found.deletedCount) {
      return false;
    }

    return true;
  }

  async updateCommentById(
    id: CommentView["id"],
    newContent: CommentView["content"]
  ) {
    let found = await this.coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content: newContent } }
    );

    if (!found.matchedCount) {
      return false;
    }

    return true;
  }

  async recalculateLikes(
    commentId: CommentView["id"],
    userId: LikeDb["userId"]
  ) {
    //TODO: избавиться
    const queryR = new LikesQueryRepository();
    const allLikes = await queryR.getLikesByParentId(commentId);

    const likes = allLikes.filter((like) => like.status === LIKE_STATUS.LIKE);
    const dislikes = allLikes.filter(
      (like) => like.status === LIKE_STATUS.DISLIKE
    );

    const userLike = allLikes.find(
      (like) => like.parentId === commentId && like.userId === userId
    );

    const res = await this.coll.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          likesInfo: {
            likesCount: likes.length,
            dislikesCount: dislikes.length,
            myStatus: userLike?.status || LIKE_STATUS.NONE,
          },
        },
      }
    );
  }

  async clearComments() {
    await this.coll.deleteMany({});

    return this;
  }
}

export const commentsCommandsRepository = new CommentsCommandsRepository();
