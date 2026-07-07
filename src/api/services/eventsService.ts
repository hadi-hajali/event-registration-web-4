import axios from "axios";
import type { EventListItem } from "../../types/event";

const BASE_URL = "http://localhost:5031/api/events";

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
  params: GetEventsParams
): Promise<EventListItem[]> => {
  const res = await axios.get<EventsResponse>(
    BASE_URL,
    {
      params,
    }
  );

  return res.data.items;
};