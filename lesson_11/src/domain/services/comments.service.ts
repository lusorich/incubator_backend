import { CommentDb, CommentView } from "../../types";
import { commentsCommandsRepository } from "../../repositories/commands/comments.commands.repository";
import { UserViewWithId } from "../../features/users/domain/user.entity";
import { PostWithId } from "../../features/posts/domain/post.entity";
import { LIKE_STATUS } from "../../features/likes/domain/like.entity";

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
    const isDelete = await commentsCommandsRepository.deleteCommentById(
      id ?? ""
    );

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
        userId: user.id ?? "",
        userLogin: user.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LIKE_STATUS.NONE,
      },
      createdAt: new Date(),
      postId: post.id,
    };

    return commentsCommandsRepository.addComment(comment);
  }
  //TODO: получить по commentId все лайки, отфильтровать по статусу
  // при проходе сравнить userId и проставить myStatus
  async recalculateLikes(commentId: CommentDb["id"]) {}

  async clearComments() {
    await commentsCommandsRepository.clearComments();

    return this;
  }
}

export const commentsService = new CommentsService();
