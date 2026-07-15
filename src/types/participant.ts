import type { PaginatedResponse } from "./common";

export interface Participant {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ParticipantRequest {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string | null;
  isActive?: boolean;
}

// Query params for GET /api/participants (F03 - 8.4 Pagination Shape)
export interface GetParticipantsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export type PaginatedParticipantsResponse = PaginatedResponse<Participant>;

export type ParticipantsPage = PaginatedParticipantsResponse;
