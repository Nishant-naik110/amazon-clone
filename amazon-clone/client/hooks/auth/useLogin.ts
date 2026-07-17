import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) =>
      apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: payload,
      }),
  });
}