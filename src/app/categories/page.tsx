"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { CATEGORIES } from "@/lib/data/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function CategoriesDirectoryPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-green-100 text-green-800 rounded-lg">
              <LayoutGrid size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              All Categories
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Select a category to explore authentic Ugandan products and subcategories
          </p>
        </div>

        {/* SHEIN-style visual category card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-10">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-600 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Category Image - SHEIN dominant visual */}
              <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <h3 className="font-black text-xs sm:text-sm drop-shadow line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-gray-200 block drop-shadow-xs">
                    {cat.subcategories.length} subcategories
                  </span>
                </div>
              </div>

              {/* Subcategories preview */}
              <div className="p-2 sm:p-2.5 bg-white text-xs text-gray-600 flex flex-wrap gap-1">
                {cat.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub.id}
                    className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 truncate max-w-[95px]"
                  >
                    {sub.name}
                  </span>
                ))}
                {cat.subcategories.length > 3 && (
                  <span className="px-1 py-0.5 text-[10px] text-green-700 font-bold">
                    +{cat.subcategories.length - 3}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
