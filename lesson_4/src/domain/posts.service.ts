import { Collection, ObjectId, WithId } from "mongodb";
import { BlogWithId, Post, PostWithId } from "../types";
import { client } from "../db/db";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../constants";
import { postsQueryRepository } from "../repositories/posts.query.repository";
import { postsCommandsRepository } from "../repositories/posts.commands.repository";
import { blogsQueryRepository } from "../repositories/blogs.query.repository";

export class PostsRepository {
  async getAllPosts() {
    const allPosts = await postsQueryRepository.getAllPosts();

    return allPosts;
  }

  async addPost(post: Post) {
    const parentBlog = await blogsQueryRepository.getBlogById(post.blogId);

    const newPost: PostWithId = {
      ...post,
      id: String(Math.round(Math.random() * 1000)),
      blogName: parentBlog?.name || "",
      createdAt: new Date(),
    };

    const newViewPost = await postsCommandsRepository.addPost(newPost);

    return newViewPost;
  }

  async getPostById(id: PostWithId["id"]) {
    const found = await postsQueryRepository.getPostById(id);

    return found;
  }

  async updatePostById(id: PostWithId["id"], props: Partial<Post>) {
    const isFound = await postsCommandsRepository.updatePostById(id, props);

    return isFound;
  }

  async deletePostById(id: PostWithId["id"]) {
    const isDelete = await postsCommandsRepository.deletePostById(id);

    return isDelete;
  }

  async clearPosts() {
    await postsCommandsRepository.clearPosts();

    return this;
  }
}

export const postsRepository = new PostsRepository();
