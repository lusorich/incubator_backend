import { BlogDocument } from '../domain/blog.entity';

export const blogOutputModelMapper = (blog?: BlogDocument | null) => {
  if (!blog) {
    return null;
  }
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
