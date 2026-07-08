import { apiClient } from "../client";
import type { PaginatedResponse } from "../../types/common";
import type {
  Registration,
  CreateRegistrationDto,
  GetRegistrationsParams,
} from "../../types/registration";

// -----------------------------
// 1. GET EVENT REGISTRATIONS
// -----------------------------
export const getEventRegistrations = (
  eventId: number,
  params: GetRegistrationsParams = {}
): Promise<PaginatedResponse<Registration>> => {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.pageSize !== undefined)
    query.append("pageSize", String(params.pageSize));
  if (params.search) query.append("search", params.search);
  if (params.status !== undefined) query.append("status", String(params.status));

  return apiClient.get<PaginatedResponse<Registration>>(
    `/events/${eventId}/registrations?${query.toString()}`
  );
};

// -----------------------------
// 2. CREATE / REACTIVATE REGISTRATION
// -----------------------------
export const createRegistration = (
  eventId: number,
  data: CreateRegistrationDto
): Promise<Registration> => {
  return apiClient.post<Registration>(
    `/events/${eventId}/registrations`,
    data
  );
};

// -----------------------------
// 3. GET REGISTRATION BY ID
// -----------------------------
export const getRegistrationById = (id: number): Promise<Registration> => {
  return apiClient.get<Registration>(`/registrations/${id}`);
};

// -----------------------------
// 4. CANCEL REGISTRATION
// -----------------------------
export const cancelRegistration = (id: number): Promise<Registration> => {
  return apiClient.patch<Registration>(`/registrations/${id}/cancel`);
};