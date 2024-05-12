import { WithId } from "mongodb";
import { QueryParams } from "../../../types";

import { ERROR_MSG, SortDirection } from "../../../constants";
import { ResultObject } from "../../../common/helpers/result.helper";
import { COMMON_RESULT_STATUSES } from "../../../common/types/common.types";
import { PostModel, PostWithId } from "../domain/post.entity";

export class PostsQueryRepository extends ResultObject {
  model: typeof PostModel;

  constructor() {
    super();
    this.model = PostModel;
  }

  async getAllPosts({
    pagination,
    sortBy,
    sortDirection,
    blogId,
  }: QueryParams & { blogId?: PostWithId["blogId"] }) {
    const { pageSize = 10, pageNumber = 1 } = pagination;

    const allPostsWithoutSorting = await this.model.find({
      blogId: {
        $regex: blogId || /./,
        $options: "i",
      },
    });

    const allPostsCount = allPostsWithoutSorting.length;

    const allPosts = await this.model
      .find({
        blogId: {
          $regex: blogId || /./,
          $options: "i",
        },
      })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .sort({ [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 });

    let allPostsToView: (PostWithId | null)[] = [];

    if (allPosts.length > 0) {
      allPostsToView = allPosts.map(this._mapToPostViewModel);
    }

    return this.getResult({
      data: {
        pagesCount: Math.ceil(allPostsCount / pageSize),
        totalCount: allPostsCount,
        pageSize,
        page: pageNumber,
        items: allPostsToView,
      },
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  async getPostById(id: PostWithId["id"]) {
    const found = await this.model.findOne({ _id: id });

    return this.getResult({
      data: this._mapToPostViewModel(found),
      status: !found
        ? COMMON_RESULT_STATUSES.NOT_FOUND
        : COMMON_RESULT_STATUSES.SUCCESS,
      errorMessage: ERROR_MSG[COMMON_RESULT_STATUSES.NOT_FOUND],
    });
  }

  _mapToPostViewModel(post: WithId<PostWithId> | null): PostWithId | null {
    if (!post) {
      return null;
    }

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  }
  //TODO: TS
  _mapToPostCommentViewModel(comment: any) {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
    };
  }
}

export const postsQueryRepository = new PostsQueryRepository();
