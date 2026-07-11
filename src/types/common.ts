export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiErrorShape {
  success: false;
  timestamp: string;
  message: string;
  errors?: string[];
}