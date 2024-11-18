import { Optional } from '@nestjs/common';

export class PaginationQueryDTO {
  @Optional()
  sortBy;

  @Optional()
  sortDirection;
}
