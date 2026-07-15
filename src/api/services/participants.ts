import { apiClient } from "../client";
import type {
  GetParticipantsParams,
  PaginatedParticipantsResponse,
  Participant,
  ParticipantRequest,
} from "../../types/participant";

type QueryParams = Record<string, string | number | boolean | undefined>;

function toQueryParams(params: GetParticipantsParams): QueryParams {
  return {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search?.trim() || undefined,
    isActive: params.isActive,
  };
}

export const getParticipants = (
  params: GetParticipantsParams = {}
): Promise<PaginatedParticipantsResponse> => {
  return apiClient.get<PaginatedParticipantsResponse>(
    "/api/participants",
    toQueryParams(params)
  );
};

export const getParticipantById = (id: number): Promise<Participant> => {
  return apiClient.get<Participant>(`/api/participants/${id}`);
};

export const createParticipant = (
  data: ParticipantRequest
): Promise<Participant> => {
  return apiClient.post<Participant>("/api/participants", data);
};

export const updateParticipant = (
  id: number,
  data: ParticipantRequest
): Promise<Participant> => {
  return apiClient.put<Participant>(`/api/participants/${id}`, data);
};

export const deleteParticipant = (id: number): Promise<void> => {
  return apiClient.delete<void>(`/api/participants/${id}`);
};
