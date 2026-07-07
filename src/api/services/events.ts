import { apiClient } from "../client";
import type { Event } from "../../types/event";

export interface GetEventsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  fromDate?: string;
  toDate?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
export const getEventById = (id: number): Promise<Event> => {
  return apiClient.get<Event>(`/events/${id}`);
};
export const getEvents = (params: GetEventsParams) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return apiClient.get<PaginatedResult<Event>>(
    `/events?${query.toString()}`
  );
};