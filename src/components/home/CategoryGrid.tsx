"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data/store";

export const CategoryGrid: React.FC = () => {
  return (
    <section className="my-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-0.5">
        <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight uppercase">
          Shop by Category
        </h2>
        <Link
          href="/categories"
          className="text-xs font-bold text-green-700 hover:text-green-900 transition"
        >
          View all →
        </Link>
      </div>

      {/* Horizontal scrollable SHEIN-style category row */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex-shrink-0 flex flex-col items-center gap-1.5"
          >
            {/* Round image tile */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 ring-2 ring-transparent group-hover:ring-green-600 transition-all duration-200 shadow-sm">
              <Image
                src={cat.image_url}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="96px"
              />
              {/* Subtle dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-full" />
            </div>
            {/* Category name */}
            <span className="text-[11px] sm:text-xs font-semibold text-gray-800 text-center max-w-[88px] leading-tight line-clamp-2 group-hover:text-green-700 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
