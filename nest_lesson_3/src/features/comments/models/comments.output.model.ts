import { CommentDocument } from '../domain/comment.entity';

export const commentOutputModelMapper = (comment?: CommentDocument | null) => {
  if (!comment) {
    return null;
  }

  return {
    id: comment.id,
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
    likesInfo: comment.likesInfo,
  };
};
