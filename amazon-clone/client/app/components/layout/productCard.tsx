import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (id: string) => void;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      {product.trending && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-amber px-2.5 py-1 text-xs font-semibold text-ink">
          Trending
        </span>
      )}

      <a href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </a>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <a href={`/product/${product.id}`} className="line-clamp-2 text-sm font-medium hover:text-ink/70">
          {product.name}
        </a>
        <p className="text-xs text-gray-500">{product.category}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold text-ink">${product.price}</span>
          <button
            onClick={() => onAddToCart(product.id)}
            className="rounded-full bg-amber px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-amber/90"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}