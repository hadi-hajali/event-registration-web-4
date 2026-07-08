const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(
  url: string,
  method: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw {
      status: response.status,
      data: data ?? {
        success: false,
        timestamp: new Date().toISOString(),
        message: `Request failed with status ${response.status}`,
      },
    };
  }

  return data as T;
}
export const apiClient = {
  get: <T>(url: string) => request<T>(url, "GET"),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, "POST", body),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, "PUT", body),
  patch: <T>(url: string, body?: unknown) =>
    request<T>(url, "PATCH", body),
  delete: <T>(url: string) => request<T>(url, "DELETE"),
};