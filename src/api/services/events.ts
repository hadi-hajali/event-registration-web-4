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



export interface CreateEventRequest {

  categoryId: number;

  name: string;

  description?: string;

  location: string;

  startAt: string;

  endAt: string;

  registrationDeadline: string;

  capacity: number;

  isActive: boolean;

}



export interface UpdateEventRequest {

  categoryId: number;

  name: string;

  description?: string;

  location: string;

  startAt: string;

  endAt: string;

  registrationDeadline: string;

  capacity: number;

  isActive: boolean;

}





// GET ALL

export const getEvents = (

  params?: GetEventsParams

): Promise<PaginatedResult<Event>> => {


  return apiClient.get<PaginatedResult<Event>>(

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

  data:CreateEventRequest

):Promise<Event>=>{


  return apiClient.post<Event>(

    "/events",

    data

  );


};







// UPDATE

export const updateEvent = (

  id:number,

  data:UpdateEventRequest

):Promise<void>=>{


  return apiClient.put<void>(

    `/events/${id}`,

    {

      id,

      ...data

    }

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