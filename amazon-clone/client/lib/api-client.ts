// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any; // accepts a raw object now, not a pre-stringified string
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}