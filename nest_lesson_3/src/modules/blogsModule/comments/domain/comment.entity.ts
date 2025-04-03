import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class CommentatorInfo {
  @Prop()
  userId: string;

  @Prop()
  userLogin: string;
}

@Schema()
export class Comment {
  @Prop()
  postId: string;

  @Prop()
  content: string;

  @Prop()
  commentatorInfo: CommentatorInfo;

  @Prop()
  createdAt: Date;

  //TODO: from likes
  @Prop({ type: Object, required: false })
  likesInfo: Record<any, any>;

  static createComment({ content, postId, userId, userLogin }) {
    const comment = new this();

    comment.content = content;
    comment.postId = postId;
    comment.commentatorInfo = { userId, userLogin };
    comment.createdAt = new Date();
    comment.likesInfo = { likesCount: 0, dislikesCount: 0, myStatus: 'None' };

    return comment;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

type CommentModelStaticType = {
  createComment: ({
    content,
    postId,
    userId,
    userLogin,
  }: {
    content: string;
    postId: string;
    userId: string;
    userLogin: string;
  }) => CommentDocument;
};

export type CommentModelType = Model<CommentDocument> & CommentModelStaticType;
