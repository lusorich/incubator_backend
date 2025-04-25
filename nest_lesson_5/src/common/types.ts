export interface PaginationParams {
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
  searchEmailTerm?: string;
  searchLoginTerm?: string;
}

export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}
