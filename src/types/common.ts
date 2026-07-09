export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: false;
  timestamp: string;
  message: string;
  errors?: string[];
}

export class ApiError extends Error {
  status: number;
  data?: ApiErrorResponse;

  constructor(status: number, data?: ApiErrorResponse) {
    super(data?.message ?? "Request failed");
    this.status = status;
    this.data = data;
  }
}