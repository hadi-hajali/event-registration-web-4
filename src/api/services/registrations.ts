import { apiClient } from "../client";
import type { PaginatedResponse } from "../../types/common";
import type {
  Registration,
  CreateRegistrationDto,
  GetRegistrationsParams,
} from "../../types/registration";

// ================= GET EVENT REGISTRATIONS =================
export const getEventRegistrations = (
  eventId: number,
  params?: GetRegistrationsParams
): Promise<PaginatedResponse<Registration>> => {
  return apiClient.get<PaginatedResponse<Registration>>(
    `/events/${eventId}/registrations`,
    params as Record<string, unknown>
  );
};

// ================= CREATE REGISTRATION =================
export const createRegistration = (
  eventId: number,
  data: CreateRegistrationDto
): Promise<Registration> => {
  return apiClient.post<Registration>(
    `/events/${eventId}/registrations`,
    data
  );
};

// ================= GET REGISTRATION =================
export const getRegistrationById = (
  id: number
): Promise<Registration> => {
  return apiClient.get<Registration>(
    `/registrations/${id}`
  );
};

// ================= CANCEL REGISTRATION =================
export const cancelRegistration = (
  id: number
): Promise<Registration> => {
  return apiClient.patch<Registration>(
    `/registrations/${id}/cancel`
  );
};