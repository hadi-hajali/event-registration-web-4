const DEFAULT_BASE_URL = 'http://localhost:5031';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const errorPayload = await response.json();
      if (typeof errorPayload?.message === 'string') {
        message = errorPayload.message;
      } else if (typeof errorPayload?.title === 'string') {
        message = errorPayload.title;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function del(path: string): Promise<void> {
  await request(path, { method: 'DELETE' });
}
