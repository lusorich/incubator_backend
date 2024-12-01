import { Injectable } from '@nestjs/common';
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

  save(comment: CommentDocument) {
    return comment.save();
  }
}
