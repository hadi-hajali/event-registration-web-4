import { apiClient } from "../client";
import type { PagedResult } from "../../types/common";
import type {
  Participant,
  ParticipantRequest,
  ParticipantsQuery,
} from "../../types/participant";

function buildQuery(params: ParticipantsQuery): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.pageSize !== undefined) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  if (params.search !== undefined && params.search.trim() !== "") {
    searchParams.set("search", params.search.trim());
  }

  if (params.isActive !== undefined) {
    searchParams.set("isActive", String(params.isActive));
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export const participantsService = {
  getAll(params: ParticipantsQuery): Promise<PagedResult<Participant>> {
    return apiClient.get<PagedResult<Participant>>(
      `/api/participants${buildQuery(params)}`
    );
  },

  getById(id: number): Promise<Participant> {
    return apiClient.get<Participant>(`/participants/${id}`);
  },

  create(data: ParticipantRequest): Promise<Participant> {
    return apiClient.post<Participant>("/participants", data);
  },

  update(id: number, data: ParticipantRequest): Promise<Participant> {
    return apiClient.put<Participant>(`/participants/${id}`, data);
  },

  remove(id: number): Promise<void> {
    return apiClient.delete(`/participants/${id}`);
  },
};