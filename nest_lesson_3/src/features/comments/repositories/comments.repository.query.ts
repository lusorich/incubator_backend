import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.entity';
import { Model } from 'mongoose';
import { commentOutputModelMapper } from '../models/comments.output.model';
import { SORT_DIRECTION } from 'src/common/types';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<Comment>,
  ) {}

  async getById(id: string) {
    try {
      const comment = await this.CommentModel.findById(id);

      if (!comment) {
        throw new NotFoundException();
      }

      return commentOutputModelMapper(comment);
    } catch (e) {
      throw new NotFoundException('Comment not found');
    }
  }

  async getPostComments({ paginationParams, postId }) {
    const { sortBy, sortDirection, pageNumber, pageSize } = paginationParams;

    const postComments = await this.CommentModel.find({ postId });

    const filteredPostComments = (
      await this.CommentModel.find({ postId })
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .sort({ [sortBy]: sortDirection === SORT_DIRECTION.ASC ? 1 : -1 })
    ).map(commentOutputModelMapper);

    return {
      pagesCount: Math.ceil(postComments.length / pageSize),
      totalCount: postComments.length,
      pageSize: Number(pageSize),
      page: Number(pageNumber),
      items: filteredPostComments,
    };
  }
}
