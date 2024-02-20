import { Collection, ObjectId, WithId } from "mongodb";
import { BlogWithId, Post, PostWithId } from "../types";
import { client } from "../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";

export class PostsRepository {
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
      return allPosts.map(this.map);
    }

    return allPosts;
  }

  async addPost(post: Post) {
    const parentBlog = await this.blogsColl.findOne({
      _id: new ObjectId(post.blogId),
    });

    const newPost: PostWithId = {
      ...post,
      id: String(Math.round(Math.random() * 1000)),
      blogName: parentBlog?.name || "",
      createdAt: new Date(),
    };

    await this.coll.insertOne(newPost);

    return this.map(newPost as WithId<PostWithId>);
  }

  async getPostById(id: PostWithId["id"]) {
    const found = await this.coll.findOne({ _id: new ObjectId(id) });

    if (!found) {
      return null;
    }

    return this.map(found);
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
      return null;
    }

    return true;
  }

  async clearPosts() {
    await this.coll.deleteMany({});

    return this;
  }

  map(post: WithId<PostWithId>): PostWithId {
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

export const postsRepository = new PostsRepository();
