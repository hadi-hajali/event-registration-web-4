const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as T;
}

export const apiClient = {
  get<T>(url: string) {
    return request<T>(url);
  },

  post<T>(url: string, body: unknown) {
    return request<T>(url, {
      method: "POST",
      body,
    });
  },

  put<T>(url: string, body: unknown) {
    return request<T>(url, {
      method: "PUT",
      body,
    });
  },

  patch<T>(url: string, body?: unknown) {
    return request<T>(url, {
      method: "PATCH",
      body,
    });
  },

  delete(url: string) {
    return request<void>(url, {
      method: "DELETE",
    });
  },
};