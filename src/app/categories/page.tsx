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

        {/* 10 Categories Grid: Square cards with round borders */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-10">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center"
            >
              {/* Square card with round borders */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs group-hover:border-green-600 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/85 transition-opacity" />
                
                {/* Category name & subcategory count inside card at bottom */}
                <div className="absolute inset-x-2 bottom-2 text-center text-white">
                  <h3 className="font-black text-xs sm:text-sm drop-shadow line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-green-300 font-bold block drop-shadow-xs mt-0.5">
                    {cat.subcategories.length} subcategories →
                  </span>
                </div>
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
