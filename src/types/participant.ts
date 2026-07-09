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
  dateOfBirth: string | null;
  isActive: boolean;
}

export interface ParticipantsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}