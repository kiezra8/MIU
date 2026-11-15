"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data/store";

export const CategoryGrid: React.FC = () => {
  // Exactly 10 categories
  const categories = CATEGORIES.slice(0, 10);

  return (
    <section className="my-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight uppercase">
          Shop by Category
        </h2>
        <Link
          href="/categories"
          className="text-xs font-bold text-green-700 hover:text-green-900 transition"
        >
          View all 10 →
        </Link>
      </div>

      {/* 5 by 2 Grid: square cards with round borders */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col items-center"
          >
            {/* Square card with round borders */}
            <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs group-hover:border-green-600 group-hover:shadow-md transition-all duration-300">
              <Image
                src={cat.image_url}
                alt={cat.name}
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                sizes="(max-width: 640px) 20vw, (max-width: 1024px) 20vw, 15vw"
              />
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Title inside card at bottom */}
              <div className="absolute inset-x-1 bottom-1 sm:inset-x-2 sm:bottom-2 text-center">
                <span className="text-[10px] sm:text-xs md:text-sm font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                  {cat.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
