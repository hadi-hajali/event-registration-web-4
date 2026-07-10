import { apiClient } from "../client";
import type {
  Participant,
  GetParticipantsParams,
} from "../../types/participant";

// Handles both plain arrays or paginated envelopes gracefully to prevent .filter crashes
export const getParticipants = async (
  params: GetParticipantsParams = {}
): Promise<Participant[]> => {
  const query = new URLSearchParams();

  // isActive=true (the common case for pickers) maps to includeInactive=false
  const includeInactive = params.isActive === false ? true : false;
  query.append("includeInactive", String(includeInactive));

  const response = await apiClient.get<any>(
    `/participants?${query.toString()}`
  );

  // Safeguard: Extract the raw array if it is wrapped inside a paginated structure
  const all: Participant[] = Array.isArray(response)
    ? response
    : response && Array.isArray(response.items)
    ? response.items
    : [];

  const search = params.search?.trim().toLowerCase();
  const filtered = search
    ? all.filter(
        (p) =>
          p.fullName.toLowerCase().includes(search) ||
          p.email.toLowerCase().includes(search) ||
          p.phone?.toLowerCase().includes(search)
      )
    : all;

  return filtered;
};

export const getParticipantById = (id: number): Promise<Participant> => {
  return apiClient.get<Participant>(`/participants/${id}`);
};