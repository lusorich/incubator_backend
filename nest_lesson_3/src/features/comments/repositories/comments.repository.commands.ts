import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.entity';

@Injectable()
export class CommentsCommandsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async createCommentForPost({ content, userId, userLogin, postId }) {
    const comment: CommentDocument = this.CommentModel.createComment({
      content,
      userId,
      userLogin,
      postId,
    });

    return this.save(comment);
  }

  async updateComment({ id, content }) {
    return this.CommentModel.updateOne(
      { _id: id },
      {
        $set: { content },
      },
    );
  }

  async updateCommentLikes({ id, likes, dislikes }) {
    return this.CommentModel.updateOne(
      { _id: id },
      {
        $set: {
          'likesInfo.likesCount': likes,
          'likesInfo.dislikesCount': dislikes,
        },
      },
    );
  }

  async deleteComment({ id }) {
    return this.CommentModel.deleteOne({ _id: id });
  }

  save(comment: CommentDocument) {
    return comment.save();
  }
}
