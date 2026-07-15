import { apiClient } from "../client";
import type { EventListItem } from "../../types/event";

export type GetEventsParams = {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
};

type EventsResponse = {
  items: EventListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};


export const getEvents = async (
  params?: GetEventsParams
): Promise<EventListItem[]> => {

  const response = await apiClient.get<EventsResponse>(
    "/api/events",
    params
  );

  return response.items;
};
