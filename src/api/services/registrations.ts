import { apiClient } from "../client";
import type {
  CreateRegistrationDto,
  GetRegistrationsParams,
  Registration,
} from "../../types/registration";

type QueryParams = Record<string, string | number | boolean | undefined>;

function toQueryParams(
  eventId: number,
  params: GetRegistrationsParams = {}
): QueryParams {
  return {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search?.trim() || undefined,
    status: params.status,
    eventId,
  };
}

// ================= GET EVENT REGISTRATIONS =================
export const getEventRegistrations = (
  eventId: number,
  params?: GetRegistrationsParams
): Promise<Registration[]> => {
  return apiClient.get<Registration[]>(
    "/api/registrations",
    toQueryParams(eventId, params)
  );
};

// ================= CREATE REGISTRATION =================
export const createRegistration = (
  eventId: number,
  data: CreateRegistrationDto
): Promise<Registration> => {
  return apiClient.post<Registration>(
    "/api/registrations",
    {
      eventId,
      ...data,
    }
  );
};

// ================= GET REGISTRATION =================
export const getRegistrationById = (
  id: number
): Promise<Registration> => {
  return apiClient.get<Registration>(
    `/api/registrations/${id}`
  );
};

// ================= CANCEL REGISTRATION =================
export const cancelRegistration = (
  id: number
): Promise<Registration> => {
  return apiClient.put<Registration>(
    `/api/registrations/${id}/cancel`
  );
};
