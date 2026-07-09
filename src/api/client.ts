const DEFAULT_BASE_URL = 'http://localhost:5031';

const baseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : response.statusText || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export async function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body });
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body });
}

export async function del(path: string): Promise<void> {
  await request<void>(path, { method: 'DELETE' });
}

export const apiClient = {
  get<T>(url: string) {
    return get<T>(url);
  },

  post<T>(url: string, body: unknown) {
    return post<T>(url, body);
  },

  put<T>(url: string, body: unknown) {
    return put<T>(url, body);
  },

  patch<T>(url: string, body?: unknown) {
    return request<T>(url, { method: 'PATCH', body });
  },

  delete(url: string) {
    return del(url);
  },
};
