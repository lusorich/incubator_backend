import { Collection, ObjectId, WithId } from "mongodb";
import { BlogWithId, PostWithId, QueryParams } from "../types";
import { client } from "../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";

export class PostsQueryRepository {
  coll: Collection<PostWithId>;
  blogsColl: Collection<BlogWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.POSTS);
    this.blogsColl = client
      .db(MONGO_DB_NAME)
      .collection(MONGO_COLLECTIONS.BLOGS);
  }

  async getAllPosts({
    pagination = {},
    sortBy = "createdAt",
    sortDirection = "desc",
    blogId,
  }: QueryParams & { blogId?: PostWithId["blogId"] }) {
    const { pageSize = 10, pageNumber = 1 } = pagination;

    const allPostsWithoutSorting = await this.coll
      .find({
        blogId: {
          $regex: blogId || /./,
          $options: "i",
        },
      })
      .toArray();

    const allPostsCount = allPostsWithoutSorting.length;

    const allPosts = await this.coll
      .find({
        blogId: {
          $regex: blogId || /./,
          $options: "i",
        },
      })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .toArray();

    let allPostsToView: (PostWithId | null)[] = [];

    if (allPosts.length > 0) {
      allPostsToView = allPosts.map(this._mapToPostViewModel);
    }

    return {
      pagesCount: Math.ceil(allPostsCount / pageSize),
      totalCount: allPostsCount,
      pageSize,
      page: pageNumber,
      items: allPostsToView,
    };
  }

  async getPostById(id: PostWithId["id"]) {
    const found = await this.coll.findOne({ _id: new ObjectId(id) });

    if (!found) {
      return null;
    }

    return this._mapToPostViewModel(found);
  }

  _mapToPostViewModel(post: WithId<PostWithId>): PostWithId {
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
}

export const postsQueryRepository = new PostsQueryRepository();
