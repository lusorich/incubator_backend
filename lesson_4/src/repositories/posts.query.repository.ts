import { Collection, ObjectId, WithId } from "mongodb";
import { BlogWithId, Post, PostWithId } from "../types";
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

  async getAllPosts() {
    const allPosts = await this.coll.find().toArray();

    if (allPosts.length > 0) {
      return allPosts.map(this._mapToPostViewModel);
    }

    return allPosts;
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
