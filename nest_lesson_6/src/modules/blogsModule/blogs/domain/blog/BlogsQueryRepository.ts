import { PaginationParams } from 'src/common/types';

export abstract class BlogsQueryRepository {
  abstract getBlogs({
    paginationParams,
  }: {
    paginationParams?: PaginationParams;
    searchNameTerm?: string;
  }): Promise<{ items: any[]; totalCount: number }>;
  abstract getBlogById(id: string): Promise<any>;
}
