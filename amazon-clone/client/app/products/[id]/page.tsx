"use client";

import { useParams } from "next/navigation";
import Navbar from "@/app/components/layout/navbar";
import { productDetailsApi, relatedProductsApi } from "@/hooks/useProducts";
import { FAKE_REVIEWS } from "@/lib/fake-reviews";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const { data: product, isLoading: productLoading } = productDetailsApi(
    { id: productId },
    !!productId
  );

  const { data: relatedData, isLoading: relatedLoading } = relatedProductsApi(
    { productId, category: product?.category },
    !!product?.category
  );

  const handleAddToCart = () => {
    console.log("add to cart:", productId);
  };

  if (productLoading) {
    return (
      <>
        <Navbar />
        <p className="py-16 text-center text-sm text-gray-500">Loading product...</p>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <p className="py-16 text-center text-sm text-gray-500">Product not found.</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full rounded-xl border border-black/5 bg-gray-50 object-cover"
            />
          </div>

          <div className="lg:col-span-1">
            <h1 className="font-display text-2xl font-bold">{product.name}</h1>
            <p className="mt-1 text-sm text-amber">
              {product.rating.toFixed(1)} ★ ({product.reviewCount.toLocaleString()} ratings)
            </p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-600">-{product.discountPercent}%</span>
              <span className="text-2xl font-bold">₹{product.price}</span>
            </div>
            <p className="text-sm text-gray-500">
              M.R.P.: <span className="line-through">₹{product.mrp}</span>
            </p>
            <p className="text-sm text-gray-600">EMI starts at ₹{product.emiPerMonth}/month</p>

            <p className="mt-4 text-sm text-gray-700">{product.description}</p>
          </div>

          <div className="rounded-xl border border-black/5 p-4 lg:col-span-1">
            <p className="text-2xl font-bold">₹{product.price}</p>
            <p className="mt-2 text-sm">
              FREE delivery <span className="font-semibold">{product.deliveryEstimate}</span>
            </p>
            <p className={`mt-2 text-sm font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}>
              {product.inStock ? "In stock" : "Out of stock"}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="mt-4 w-full rounded-full bg-amber py-2 text-sm font-semibold text-ink hover:bg-amber/90 disabled:opacity-50"
            >
              Add to cart
            </button>

            <div className="mt-4 border-t border-black/5 pt-4">
              <p className="text-xs font-semibold text-gray-500">Payment options</p>
              <ul className="mt-1 space-y-1">
                {product.paymentOptions.map((opt: any) => (
                  <li key={opt.id} className="text-xs text-gray-600">{opt.label}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold">Related products</h2>
          {relatedLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedData?.products?.map((p) => (
                <a
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="rounded-lg border border-black/5 p-2 hover:shadow-md"
                >
                  <img src={p.imageUrl} alt={p.name} className="aspect-square w-full rounded object-cover" />
                  <p className="mt-1 line-clamp-2 text-xs">{p.name}</p>
                  <p className="text-sm font-bold">₹{p.price}</p>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold">Customer reviews</h2>
          <div className="space-y-4">
            {FAKE_REVIEWS.map((r) => (
              <div key={r.id} className="border-b border-black/5 pb-3">
                <p className="text-sm font-semibold">{r.author}</p>
                <p className="text-amber text-sm">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </p>
                <p className="mt-1 text-sm text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}