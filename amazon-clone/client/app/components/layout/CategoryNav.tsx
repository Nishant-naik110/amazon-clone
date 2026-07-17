"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryNav({ active }: { active?: string }) {
  return (
    <nav className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          const href = cat === "All" ? "/" : `/category/${encodeURIComponent(cat)}`;
          return (
            <Link
              key={cat}
              href={href}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "text-ink" : "text-gray-500 hover:text-ink"
              }`}
            >
              {cat}
              {isActive && (
                <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-amber" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
