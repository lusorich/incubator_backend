import { Collection, ObjectId, WithId } from "mongodb";
import {
  MONGO_COLLECTIONS,
  MONGO_DB_NAME,
  SortDirection,
} from "../../constants";
import { client } from "../../db/db";
import { CommentDb, CommentView, QueryParams } from "../../types";
import { postsQueryRepository } from "../../features/posts/repositories/posts.query.repository";
import { PostWithId } from "../../features/posts/domain/post.entity";
import { BlogWithId } from "../../features/blogs/domain/blog.entity";
import { ResultObject } from "../../common/helpers/result.helper";

export class CommentsQueryRepository extends ResultObject {
  coll: Collection<CommentDb>;

  constructor() {
    super();
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.COMMENTS);
  }

  async getCommentsByPostId({
    pagination,
    sortBy,
    sortDirection,
    postId,
  }: QueryParams & { postId: PostWithId["id"] }) {
    const { pageSize = 10, pageNumber = 1 } = pagination;

    const allCommentsWithoutLimit = await this.coll
      .find({ postId: { $regex: postId, $options: "i" } })
      .toArray();

    const allComments = await this.coll
      .find({ postId: { $regex: postId, $options: "i" } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .sort({ [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 })
      .toArray();

    let allCommentsToView: (CommentView | null)[] = [];

    if (allComments.length > 0) {
      allCommentsToView = allComments.map(this._mapToCommentViewModel);
    }

    return {
      pagesCount: Math.ceil(allCommentsWithoutLimit.length / pageSize),
      totalCount: allCommentsWithoutLimit.length,
      pageSize,
      page: pageNumber,
      items: allCommentsToView,
    };
  }

  async getCommentById(id: BlogWithId["id"]) {
    try {
      const found = await this.coll.findOne({ _id: new ObjectId(id) });

      if (!found) {
        return null;
      }

      return this._mapToCommentViewModel(found);
    } catch (e) {
      return null;
    }
  }

  _mapToCommentViewModel(
    comment: WithId<CommentDb> | null
  ): CommentView | null {
    if (!comment) {
      return null;
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      likesInfo: comment?.likesInfo,
      createdAt: comment.createdAt,
    };
  }
}

export const commentsQueryRepository = new CommentsQueryRepository();
