"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/layout/navbar";
import CategoryNav from "../../components/layout/CategoryNav";
import ProductGrid from "../../components/layout/productGrid";
import { categoryProductsApi } from "@/hooks/useProducts";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = decodeURIComponent(slug);
  const [page, setPage] = useState(1);

  const { data: productsData, isLoading } = categoryProductsApi({ category, page, limit: 20 });

  const handleAddToCart = (id: string) => {
    console.log("add to cart:", id);
  };

  return (
    <>
      <Navbar />
      <CategoryNav active={category} />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 font-display text-2xl font-bold">{category}</h1>
        {isLoading ? (
          <p className="py-16 text-center text-sm text-gray-500">Loading products...</p>
        ) : (
          <ProductGrid products={productsData?.products ?? []} onAddToCart={handleAddToCart} />
        )}

        {/* Pagination */}
        {productsData && productsData.pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded bg-gray-200 px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {productsData.pagination.page} of {productsData.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= productsData.pagination.totalPages}
              className="rounded bg-gray-200 px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}
