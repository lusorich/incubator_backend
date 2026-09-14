import { ObjectId, WithId } from "mongodb";

import { Post, PostModel, PostWithId } from "../domain/post.entity";
import { postsQueryRepository } from "./posts.query.repository";

export class PostsCommandsRepository {
  model: typeof PostModel;

  constructor() {
    this.model = PostModel;
  }

  async addPost(post: PostWithId) {
    const result = await this.model.create(post);

    return postsQueryRepository._mapToPostViewModel(
      result as WithId<PostWithId>
    );
  }

  async updatePostById(id: PostWithId["id"], props: Partial<Post>) {
    let found = await this.model.updateOne({ _id: id }, { $set: { ...props } });

    if (!found.matchedCount) {
      return null;
    }

    return true;
  }

  async deletePostById(id: PostWithId["id"]) {
    const found = await this.model.deleteOne({ _id: id });

    if (!found.deletedCount) {
      return false;
    }

    return true;
  }

  async clearPosts() {
    await this.model.deleteMany({});

    return this;
  }
}

export const postsCommandsRepository = new PostsCommandsRepository();
