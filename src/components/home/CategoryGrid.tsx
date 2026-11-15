"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data/store";

export const CategoryGrid: React.FC = () => {
  // Exactly 10 categories
  const categories = CATEGORIES.slice(0, 10);
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0].id);

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  return (
    <section className="my-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight uppercase">
          Shop by Category
        </h2>
        <Link
          href="/categories"
          className="text-xs font-bold text-green-700 hover:text-green-900 transition flex items-center gap-0.5"
        >
          <span>View all 10</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* 5 by 2 Grid: square cards with round borders */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className="group flex flex-col items-center text-left focus:outline-none"
            >
              {/* Square card with round borders */}
              <div
                className={`relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border transition-all duration-300 ${
                  isSelected
                    ? "border-green-600 ring-2 ring-green-600 shadow-md scale-[1.02]"
                    : "border-gray-200 group-hover:border-green-500 shadow-xs"
                }`}
              >
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  sizes="(max-width: 640px) 20vw, (max-width: 1024px) 20vw, 15vw"
                />
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                {/* Title inside card at bottom */}
                <div className="absolute inset-x-1 bottom-1 sm:inset-x-2 sm:bottom-2 text-center">
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                    {cat.name}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Subcategories Row: Circular circles with image in it and word underneath ── */}
      <div className="mt-5 p-3.5 sm:p-4 bg-gray-50/80 rounded-2xl border border-gray-100 animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
            <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-tight">
              {activeCategory.name} Subcategories
            </h3>
          </div>
          <Link
            href={`/categories/${activeCategory.slug}`}
            className="text-xs font-bold text-green-700 hover:text-green-900 transition"
          >
            Explore all {activeCategory.name} →
          </Link>
        </div>

        {/* Circular circles with image and word */}
        <div className="flex items-start gap-3 sm:gap-5 overflow-x-auto no-scrollbar py-1 px-1">
          {activeCategory.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/categories/${activeCategory.slug}?sub=${sub.slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              {/* Circular circle with image in it */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-green-600 shadow-xs transition-transform duration-200 group-hover:scale-108 bg-white">
                <Image
                  src={sub.image_url}
                  alt={sub.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* Word for the subcategory */}
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-800 text-center max-w-[70px] sm:max-w-[85px] line-clamp-1 group-hover:text-green-700 transition-colors">
                {sub.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
