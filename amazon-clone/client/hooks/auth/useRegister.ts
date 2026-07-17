import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

// Shape of what we send to the server
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

// Shape of what the server sends back (matches your Express route's res.json(...))
type RegisterResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload) =>
      apiFetch<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: payload,
      }),
  });
}