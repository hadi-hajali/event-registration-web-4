import { apiClient } from "../client";
import type {
  Participant,
  GetParticipantsParams,
} from "../../types/participant";

// The API currently returns a plain array (no pagination envelope) and only
// supports filtering by `includeInactive`. `search`/`page`/`pageSize` are
// applied on the client side below until the backend adds real support for them.
export const getParticipants = async (
  params: GetParticipantsParams = {}
): Promise<Participant[]> => {
  const query = new URLSearchParams();

  // isActive=true (the common case for pickers) maps to includeInactive=false
  const includeInactive = params.isActive === false ? true : false;
  query.append("includeInactive", String(includeInactive));

  const all = await apiClient.get<Participant[]>(
    `/participants?${query.toString()}`
  );

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