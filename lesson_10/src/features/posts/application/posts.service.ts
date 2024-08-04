import { postsCommandsRepository } from "../repositories/posts.commands.repository";
import { blogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { Post, PostWithId } from "../domain/post.entity";

export class PostsService {
  async addPost(post: Post) {
    const parentBlog = await blogsQueryRepository.getBlogById(post.blogId);

    const newPost: PostWithId = {
      ...post,
      blogName: parentBlog?.data?.name || "",
      createdAt: new Date(),
    };

    const newViewPost = await postsCommandsRepository.addPost(newPost);

    return newViewPost;
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

export const postsService = new PostsService();
