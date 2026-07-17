"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/layout/navbar";
import CategoryNav from "./components/layout/CategoryNav";
import ProductGrid from "./components/layout/productGrid";
import { useAuth } from "@/context/authContext";
import { categoryProductsApi } from "@/hooks/useProducts";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const { data: productsData, isLoading: productsLoading } = categoryProductsApi({
    category: "All",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const handleAddToCart = (id: string) => {
    console.log("add to cart:", id);
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <CategoryNav active="All" />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 font-display text-2xl font-bold">Trending products</h1>
        {productsLoading ? (
          <p className="py-16 text-center text-sm text-gray-500">Loading products...</p>
        ) : (
          <ProductGrid products={productsData?.products ?? []} onAddToCart={handleAddToCart} />
        )}
      </main>
    </>
  );
}
