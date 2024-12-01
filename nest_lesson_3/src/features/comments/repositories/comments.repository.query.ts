import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.entity';
import { Model } from 'mongoose';
import { commentOutputModelMapper } from '../models/comments.output.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<Comment>,
  ) {}

  async getById(id: string) {
    try {
      const comment = await this.CommentModel.findById(id);

      return commentOutputModelMapper(comment);
    } catch (e) {
      throw new NotFoundException('Comment not found');
    }
  }
}
