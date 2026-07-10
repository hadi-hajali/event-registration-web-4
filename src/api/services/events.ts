import { apiClient } from "../client";
import type { Event, EventFormValues, EventListItem } from "../../types/event";
import type { PaginatedResponse } from "../../types/common";


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

): Promise<PaginatedResponse<EventListItem>> => {


  return apiClient.get<PaginatedResponse<EventListItem>>(

    "/events",

    params as Record<string, unknown>

  );


};






// GET BY ID

export const getEventById = (

  id:number

):Promise<Event>=>{


  return apiClient.get<Event>(

    `/events/${id}`

  );


};







// CREATE

export const createEvent = (

  data:EventFormValues

):Promise<Event>=>{


  return apiClient.post<Event>(

    "/events",

    data

  );


};







// UPDATE

export const updateEvent = (

  id:number,

  data:EventFormValues

):Promise<Event>=>{


  return apiClient.put<Event>(

    `/events/${id}`,

    data

  );


};







// DELETE

export const deleteEvent = (

  id:number

):Promise<void>=>{


  return apiClient.delete<void>(

    `/events/${id}`

  );


};

export const setEventActiveState = (
  id: number,
  isActive: boolean
): Promise<Event> => {
  return apiClient.patch<Event>(
    `/events/${id}/active`,
    { isActive }
  );
};
