import { apiClient } from "../client";
import type { Event, EventFormValues, EventListItem } from "../../types/event";
import type { PagedResult } from "../../types/common";

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  return parts.length ? `?${parts.join('&')}` : '';
}


export interface GetEventsParams {

  page?: number;

  pageSize?: number;

  search?: string;

  categoryId?: number;

  isActive?: boolean;

  fromDate?: string;

  toDate?: string;

}



// GET ALL


export const getEvents = (
  params?: GetEventsParams
): Promise<PagedResult<EventListItem>> => {
  const q = buildQuery(params as Record<string, unknown> | undefined);
  return apiClient.get<PagedResult<EventListItem>>(`/api/events${q}`);
};






// GET BY ID

export const getEventById = (

  id:number

):Promise<Event>=>{


  return apiClient.get<Event>(

    `/api/events/${id}`

  );


};







// CREATE

export const createEvent = (

  data:EventFormValues

):Promise<Event>=>{


  return apiClient.post<Event>(

    "/api/events",

    data

  );


};







// UPDATE

export const updateEvent = (

  id:number,

  data:EventFormValues

):Promise<Event>=>{


  return apiClient.put<Event>(

    `/api/events/${id}`,

    data

  );


};







// DELETE

export const deleteEvent = (

  id:number

):Promise<void>=>{


  return apiClient.delete<void>(

    `/api/events/${id}`

  );


};

export const setEventActiveState = (
  id: number,
  isActive: boolean
): Promise<Event> => {
  return apiClient.patch<Event>(
    `/api/events/${id}/active`,
    { isActive }
  );
};
