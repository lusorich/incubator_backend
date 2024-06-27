import { BlogDocument } from '../domain/blog.entity';

export const blogOutputModelMapper = (blog: BlogDocument) => ({
  id: blog.id,
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
});
