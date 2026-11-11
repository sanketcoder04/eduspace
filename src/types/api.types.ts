export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index, zero-based
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string; // e.g. "createdAt, desc"
}

export interface SliceResponse<T> {
  content: T[];
  page: number;
  size: number;
  hasNext: boolean;
}
