import { BlogDocument } from './blog.entity';

export class BlogViewDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  websiteUrl: string;
  isMembership: boolean;

  static getBlogView(blog: BlogDocument): BlogViewDto {
    const dto = new BlogViewDto();

    dto.id = blog.id;
    dto.name = blog.name;
    dto.description = blog.description;
    dto.createdAt = blog.createdAt;
    dto.websiteUrl = blog.websiteUrl;
    dto.isMembership = blog.isMembership;

    return dto;
  }
}

export class BlogPostVewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikedInfo: any;
}
