import { PostDocument } from '../domain/post.entity';

export const postOutputModelMapper = (post?: PostDocument | null) => {
  if (!post) {
    return null;
  }
  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
