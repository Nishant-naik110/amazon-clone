"use client";

import Navbar from "@/app/components/layout/navbar";
import { useCart } from "./useCart";
import { useUpdateCartItem } from "./useUpdateCartItem";
import { useRemoveCartItem } from "./useRemoveCartItem";

export default function CartPage() {
  const { data, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  const cartItems = data?.cartItems ?? [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <p className="py-16 text-center text-sm text-gray-500">Loading cart...</p>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
          <a href="/" className="mt-4 inline-block text-sm text-ink underline">
            Continue shopping
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-6 font-display text-2xl font-bold">Shopping Cart</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-black/5 bg-white p-4"
              >
                <a href={`/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </a>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <a
                      href={`/product/${item.product.id}`}
                      className="text-sm font-medium hover:text-ink/70"
                    >
                      {item.product.name}
                    </a>
                    <p className="mt-1 text-lg font-bold">₹{item.product.price}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCartItem.mutate({
                            id: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        disabled={updateCartItem.isPending}
                        className="h-7 w-7 rounded-full border border-black/10 text-sm hover:bg-gray-50"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartItem.mutate({
                            id: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                        disabled={updateCartItem.isPending}
                        className="h-7 w-7 rounded-full border border-black/10 text-sm hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeCartItem.mutate(item.id)}
                      disabled={removeCartItem.isPending}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-xl border border-black/5 bg-white p-4">
            <p className="text-sm text-gray-600">
              Subtotal ({cartItems.reduce((n, i) => n + i.quantity, 0)} items)
            </p>
            <p className="mt-1 text-2xl font-bold">₹{subtotal.toFixed(2)}</p>
            <button className="mt-4 w-full rounded-full bg-amber py-2 text-sm font-semibold text-ink hover:bg-amber/90">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </main>
    </>
  );
}