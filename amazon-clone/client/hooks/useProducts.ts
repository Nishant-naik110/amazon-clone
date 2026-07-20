import { useApi } from "@/hooks/auth/useApi";
import { Product } from "@/lib/types";

type ProductsPayload = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
};

type ProductsResponse = {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const categoryProductsApi = (payload: ProductsPayload, enabled: boolean = true) => {
  return useApi<ProductsResponse>(
    "/api/products/filter",
    "POST",
    payload,
    {
      queryKey: ["categoryProductsApi", payload.category, payload.page, payload.limit],
      enabled,
    }
  );
};

type ProductDetailsPayload = {
  id: string;
};

export const productDetailsApi = (payload: ProductDetailsPayload, enabled: boolean = true) => {
  return useApi<any>(
    "/api/products/details",
    "POST",
    payload,
    {
      queryKey: ["productDetailsApi", payload.id],
      enabled,
    }
  );
};

type RelatedProductsPayload = {
  productId?: string;
  category?: string;
};

export const relatedProductsApi = (payload: RelatedProductsPayload, enabled: boolean = true) => {
  return useApi<{ products: Product[] }>(
    "/api/products/related",
    "POST",
    payload,
    {
      queryKey: ["relatedProductsApi", payload.productId, payload.category],
      enabled,
    }
  );
};
