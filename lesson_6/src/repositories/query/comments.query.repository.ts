import { Collection, ObjectId, WithId } from "mongodb";
import {
  MONGO_COLLECTIONS,
  MONGO_DB_NAME,
  SortDirection,
} from "../../constants";
import { client } from "../../db/db";
import {
  BlogWithId,
  CommentDb,
  CommentView,
  PostWithId,
  QueryParams,
} from "../../types";
import { postsQueryRepository } from "./posts.query.repository";

export class CommentsQueryRepository {
  coll: Collection<CommentDb>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.COMMENTS);
  }

  async getCommentsByPostId({
    pagination,
    sortBy,
    sortDirection,
    postId,
  }: QueryParams & { postId: PostWithId["id"] }) {
    const { pageSize = 10, pageNumber = 1 } = pagination;

    const allCommentsWithoutSorting = await this.coll.find().toArray();
    const allCommentsCount = allCommentsWithoutSorting.length;

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
      pagesCount: Math.ceil(allCommentsCount / pageSize),
      totalCount: allCommentsCount,
      pageSize,
      page: pageNumber,
      items: allCommentsToView,
    };
  }

  async getCommentById(id: BlogWithId["id"]) {
    const found = await this.coll.findOne({ _id: new ObjectId(id) });

    if (!found) {
      return null;
    }

    return this._mapToCommentViewModel(found);
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
      createdAt: comment.createdAt,
    };
  }
}

export const commentsQueryRepository = new CommentsQueryRepository();
