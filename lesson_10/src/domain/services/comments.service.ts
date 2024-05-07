import {
  CommentDb,
  CommentView,
  Post,
  PostWithId,
  UserViewWithId,
} from "../../types";
import { postsCommandsRepository } from "../../features/posts/repositories/posts.commands.repository";
import { blogsQueryRepository } from "../../features/blogs/repositories/blogs.query.repository";
import { commentsCommandsRepository } from "../../repositories/commands/comments.commands.repository";

export class CommentsService {
  async updateCommentById(
    id: CommentView["id"],
    props: CommentView["content"]
  ) {
    const isFound = await commentsCommandsRepository.updateCommentById(
      id,
      props
    );

    return isFound;
  }

  async deleteCommentById(id: PostWithId["id"]) {
    const isDelete = await commentsCommandsRepository.deleteCommentById(id);

    return isDelete;
  }

  async addComment({
    user,
    post,
    content,
  }: {
    user: UserViewWithId;
    post: PostWithId;
    content: string;
  }) {
    const comment: CommentDb = {
      id: String(Math.round(Math.random() * 1000)),
      content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date(),
      postId: post.id,
    };

    return commentsCommandsRepository.addComment(comment);
  }

  async clearComments() {
    await commentsCommandsRepository.clearComments();

    return this;
  }
}

export const commentsService = new CommentsService();
