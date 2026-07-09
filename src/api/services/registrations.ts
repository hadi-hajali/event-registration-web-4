import { del, get, post, put } from '../client';
import type {
  CreateRegistrationRequest,
  Registration,
  RegistrationFilters,
} from '../../types/registration';

function buildQuery(params: Record<string, string | number | undefined | '' | null>) {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  return parts.length ? `?${parts.join('&')}` : '';
}

export async function getRegistrations(filters: RegistrationFilters): Promise<Registration[]> {
  const q = buildQuery({
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 10,
    search: filters.search ?? '',
    status: filters.status ?? '',
    eventId: filters.eventId ?? '',
    participantId: filters.participantId ?? '',
  });

  return get<Registration[]>(`/api/registrations${q}`);
}

export async function getRegistrationById(id: number): Promise<Registration> {
  return get<Registration>(`/api/registrations/${id}`);
}

export async function createRegistration(payload: CreateRegistrationRequest): Promise<Registration> {
  return post<Registration>('/api/registrations', payload);
}

export async function cancelRegistration(id: number): Promise<Registration> {
  return put<Registration>(`/api/registrations/${id}/cancel`, {});
}

export async function deleteRegistration(id: number): Promise<void> {
  await del(`/api/registrations/${id}`);
}
