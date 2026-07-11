const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is missing. Please check your .env file"
  );
}


async function request<T>(
  url: string,
  method: string,
  body?: unknown,
  params?: Record<string, unknown>
): Promise<T> {

  let fullUrl = `${BASE_URL}${url}`;


  if (params) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();

    if (queryString) {
      fullUrl += `?${queryString}`;
    }
  }


  const response = await fetch(fullUrl, {
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

  const data = text
    ? JSON.parse(text)
    : null;


  if (!response.ok) {

    throw {
      status: response.status,
      data: data ?? {
        success: false,
        timestamp: new Date().toISOString(),
        message: `Request failed with status ${response.status}`,
        errors: [],
      },
    };

  }


  return data as T;
}



export const apiClient = {

  get: <T>(
    url: string,
    params?: Record<string, unknown>
  ) =>
    request<T>(
      url,
      "GET",
      undefined,
      params
    ),


  post: <T>(
    url: string,
    body?: unknown
  ) =>
    request<T>(
      url,
      "POST",
      body
    ),


  put: <T>(
    url: string,
    body?: unknown
  ) =>
    request<T>(
      url,
      "PUT",
      body
    ),


  patch: <T>(
    url: string,
    body?: unknown
  ) =>
    request<T>(
      url,
      "PATCH",
      body
    ),


  delete: <T>(
    url: string
  ) =>
    request<T>(
      url,
      "DELETE"
    ),

};
