"use client";

import { useState } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/context/authContext";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <a href="/" className="shrink-0 font-display text-xl font-bold tracking-tight">
          shop<span className="text-amber">.</span>
        </a>

        <div className="relative flex-1 max-w-2xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border-none bg-white/95 py-2 pl-4 pr-10 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {user ? (
            <button onClick={logout} className="flex items-center gap-1.5 text-sm hover:text-amber transition-colors">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <a href="/login" className="flex items-center gap-1.5 text-sm hover:text-amber transition-colors">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Sign in</span>
            </a>
          )}
          <a href="/cart" className="relative flex items-center gap-1.5 text-sm hover:text-amber transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
          </a>
        </div>
      </div>
    </header>
  );
}