import { apiClient } from "../client";
import type { PaginatedResponse } from "../../types/common";
import type {
  CreateRegistrationDto,
  GetRegistrationsParams,
  Registration,
} from "../../types/registration";

type QueryParams = Record<string, string | number | boolean | undefined>;

function toQueryParams(
  params: GetRegistrationsParams = {}
): QueryParams {
  return {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search?.trim() || undefined,
    status: params.status,
  };
}

// ================= GET EVENT REGISTRATIONS =================
export const getEventRegistrations = (
  eventId: number,
  params?: GetRegistrationsParams
): Promise<PaginatedResponse<Registration>> => {
  return apiClient.get<PaginatedResponse<Registration>>(
    `/api/events/${eventId}/registrations`,
    toQueryParams(params)
  );
};

// ================= CREATE REGISTRATION =================
export const createRegistration = (
  eventId: number,
  data: CreateRegistrationDto
): Promise<Registration> => {
  return apiClient.post<Registration>(
    `/api/events/${eventId}/registrations`,
    data
  );
};

// ================= GET REGISTRATION =================
export const getRegistrationById = (
  eventId: number,
  id: number
): Promise<Registration> => {
  return apiClient.get<Registration>(
    `/api/events/${eventId}/registrations/${id}`
  );
};

// ================= CANCEL REGISTRATION =================
export const cancelRegistration = (
  eventId: number,
  id: number
): Promise<Registration> => {
  return apiClient.patch<Registration>(
    `/api/events/${eventId}/registrations/${id}/cancel`
  );
};
