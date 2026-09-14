import { Type } from 'class-transformer';
import { SORT_DIRECTION } from './types';

export class PaginationParams {
  @Type(() => Number)
  pageNumber: number = 1;
  @Type(() => Number)
  pageSize: number = 10;
  sortDirection: SORT_DIRECTION = SORT_DIRECTION.DESC;
}

export abstract class BaseSortablePaginationParams<T> extends PaginationParams {
  abstract sortBy: T;
}

export abstract class PaginatedViewDto<T> {
  abstract items: T;
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;

  public static getPaginatedDataDto<T>({
    items,
    page,
    pageSize,
    totalCount,
  }: {
    items: T;
    page: number;
    pageSize: number;
    totalCount: number;
  }): PaginatedViewDto<T> {
    return {
      totalCount,
      pagesCount: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
      items,
    };
  }
}
