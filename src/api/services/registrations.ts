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
  return apiClient
    .get<any>("/registrations", {
      ...(params as Record<string, unknown>),
      eventId,
    })
    .then((response) => {
      // Safely handle both standard arrays and paginated object envelopes
      const items = Array.isArray(response) 
        ? response 
        : (response && Array.isArray(response.items) ? response.items : []);
        
      const totalCount = Array.isArray(response)
        ? response.length
        : (response && typeof response.totalCount === 'number' ? response.totalCount : items.length);

      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
      };
    });
};

// ================= CREATE REGISTRATION =================
export const createRegistration = (
  eventId: number,
  data: CreateRegistrationDto
): Promise<Registration> => {
  return apiClient.post<Registration>(
    "/registrations",
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
    `/registrations/${id}`
  );
};

// ================= CANCEL REGISTRATION =================
export const cancelRegistration = (
  id: number
): Promise<Registration> => {
  return apiClient.put<Registration>(
    `/registrations/${id}/cancel`
  );
};
