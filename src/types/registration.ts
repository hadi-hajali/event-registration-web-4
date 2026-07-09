export type Status = 1 | 2; // 1 = Active, 2 = Cancelled

export interface Registration {
  id: number;
  eventId: number;
  eventName: string;
  participantId: number;
  participantName: string;
  participantEmail: string;
  status: Status;
  notes?: string;
  registeredAt: string; // ISO timestamp
  cancelledAt?: string | null; // ISO timestamp or null
}

export interface CreateRegistrationRequest {
  eventId: number;
  participantId: number;
  notes?: string;
}

export interface RegistrationFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: Status | '';
  eventId?: number | '';
  participantId?: number | '';
}

export interface PaginatedRegistrations {
  items: Registration[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}
