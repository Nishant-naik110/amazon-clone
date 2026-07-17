import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

type UseApiOptions = {
  queryKey: unknown[];
  enabled?: boolean;
};

export function useApi<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  payload: any,
  options: UseApiOptions
): UseQueryResult<T> {
  return useQuery<T>({
    queryKey: options.queryKey,
    queryFn: () =>
      apiFetch<T>(url, {
        method,
        body: method !== "GET" ? payload : undefined,
      }),
    enabled: options.enabled ?? true,
  });
}