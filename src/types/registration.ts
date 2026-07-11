import type { PaginatedResponse } from "./common";

export const RegistrationStatus = {
  Active: 1,
  Cancelled: 2,
} as const;

export type RegistrationStatus =
  (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

export interface Registration {
  id: number;
  eventId: number;
  eventName: string;
  participantId: number;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  status: RegistrationStatus;
  statusName: string;
  notes: string | null;
  registeredAt: string;
  cancelledAt: string | null;
}

// Request body for POST /api/events/{eventId}/registrations (8.1 / F04)
export interface CreateRegistrationDto {
  participantId: number;
  notes?: string;
}

export interface GetRegistrationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: RegistrationStatus;
}

export type RegistrationsPage = PaginatedResponse<Registration>;
