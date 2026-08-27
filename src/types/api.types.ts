// Mirrors Spring Data's Page<T> JSON shape, used by every paginated endpoint
// across Opportunity, Application, Chat, and Notification.

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
