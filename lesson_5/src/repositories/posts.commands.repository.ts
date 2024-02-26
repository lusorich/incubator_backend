import { Collection, ObjectId, WithId } from "mongodb";
import { BlogWithId, Post, PostWithId } from "../types";
import { client } from "../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { postsQueryRepository } from "./posts.query.repository";

export class PostsCommandsRepository {
  coll: Collection<PostWithId>;
  blogsColl: Collection<BlogWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.POSTS);
    this.blogsColl = client
      .db(MONGO_DB_NAME)
      .collection(MONGO_COLLECTIONS.BLOGS);
  }

  async addPost(post: PostWithId) {
    await this.coll.insertOne(post);

    return postsQueryRepository._mapToPostViewModel(post as WithId<PostWithId>);
  }

  async updatePostById(id: PostWithId["id"], props: Partial<Post>) {
    let found = await this.coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...props } }
    );

    if (!found.matchedCount) {
      return null;
    }

    return true;
  }

  async deletePostById(id: PostWithId["id"]) {
    const found = await this.coll.deleteOne({ _id: new ObjectId(id) });

    if (!found.deletedCount) {
      return false;
    }

    return true;
  }

  async clearPosts() {
    await this.coll.deleteMany({});

    return this;
  }
}

export const postsCommandsRepository = new PostsCommandsRepository();
