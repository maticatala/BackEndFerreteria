
export class PaginationResponseDto<T> {

  results: T[];

  meta: Meta
}

class Meta {

  totalItems: number;

  itemCount: number;

  itemsPerPage: number;

  totalPages: number;

  currentPage: number;

}