import { Product } from "@/lib/mock-data";
import ProductCard from "./productCard";

export default function ProductGrid({
  products,
  onAddToCart,
}: {
  products: Product[];
  onAddToCart: (id: string) => void;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-gray-500">
        No products match your search. Try a different keyword or category.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}