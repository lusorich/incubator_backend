import { CommentDocument } from '../domain/comment.entity';

export const commentOutputModelMapper = (comment?: CommentDocument | null) => {
  if (!comment) {
    return null;
  }

  return {
    id: comment.id,
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: comment.likesInfo,
  };
};
