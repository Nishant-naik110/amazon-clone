import { useApi } from "@/hooks/auth/useApi";

export const useCart = (enabled: boolean = true) => {
  return useApi<{ cartItems: any[] }>(
    "/api/cart",
    "GET",
    {},
    {
      queryKey: ["cart"],
      enabled,
    }
  );
};