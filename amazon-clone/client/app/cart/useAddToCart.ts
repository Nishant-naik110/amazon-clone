import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

type AddToCartPayload = {
  productId: string;
  quantity?: number;
};

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) =>
      apiFetch("/api/cart/add", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      // tells TanStack Query the cart is stale — refetches it automatically
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}