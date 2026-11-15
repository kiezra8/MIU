"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/data/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ProductCard } from "@/components/product/ProductCard";

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const initialSub = searchParams.get("sub") || "all";

  const category = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[0];
  const [selectedSub, setSelectedSub] = useState<string>(initialSub);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [priceRange, setPriceRange] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => p.category_id === category.id || p.category_name === category.name);

    if (selectedSub !== "all") {
      const sub = category.subcategories.find((s) => s.slug === selectedSub);
      if (sub) {
        result = result.filter((p) => p.subcategory_id === sub.id || p.subcategory_name === sub.name);
      }
    }

    if (priceRange === "under50k") {
      result = result.filter((p) => p.price_ugx < 50000);
    } else if (priceRange === "50k-150k") {
      result = result.filter((p) => p.price_ugx >= 50000 && p.price_ugx <= 150000);
    } else if (priceRange === "above150k") {
      result = result.filter((p) => p.price_ugx > 150000);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "popular":
        result.sort((a, b) => b.sales_count - a.sales_count);
        break;
      case "price-low":
        result.sort((a, b) => a.price_ugx - b.price_ugx);
        break;
      case "price-high":
        result.sort((a, b) => b.price_ugx - a.price_ugx);
        break;
      case "discount":
        result.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0));
        break;
    }

    return result;
  }, [category, selectedSub, priceRange, sortBy]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-green-800 transition">
          Home
        </Link>
        <ChevronRight size={13} />
        <Link href="/categories" className="hover:text-green-800 transition">
          Categories
        </Link>
        <ChevronRight size={13} />
        <span className="text-gray-900 font-semibold">{category.name}</span>
      </nav>

      {/* Category Header Banner with Image */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 text-white mb-6">
        <div className="relative h-32 sm:h-44 w-full">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex flex-col justify-center px-6 sm:px-10">
            <span className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">
              Made In Uganda
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 max-w-xl line-clamp-2 mt-1">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Minor Subcategories — Visual SHEIN Cards with Images */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-800">
            Select Subcategory
          </h2>
          {selectedSub !== "all" && (
            <button
              onClick={() => setSelectedSub("all")}
              className="text-xs font-bold text-green-700 hover:text-green-900"
            >
              Reset to all
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {/* "All" button */}
          <button
            onClick={() => setSelectedSub("all")}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                selectedSub === "all"
                  ? "bg-green-700 text-white border-green-700 shadow-sm"
                  : "bg-gray-100 text-gray-700 border-gray-200 group-hover:border-green-600"
              }`}
            >
              All
            </div>
            <span className="text-[11px] font-semibold text-gray-800 text-center max-w-[70px] truncate">
              All
            </span>
          </button>

          {/* Subcategory Visual Cards with Images */}
          {category.subcategories.map((sub) => {
            const isSelected = selectedSub === sub.slug;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSub(sub.slug)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition shadow-xs ${
                    isSelected
                      ? "ring-2 ring-green-600 border-white scale-105"
                      : "border-transparent group-hover:border-green-500"
                  }`}
                >
                  <Image
                    src={sub.image_url}
                    alt={sub.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <div className={`absolute inset-0 transition ${isSelected ? "bg-black/20" : "bg-black/0 group-hover:bg-black/10"}`} />
                </div>
                <span
                  className={`text-[11px] font-semibold text-center max-w-[80px] line-clamp-1 transition ${
                    isSelected ? "text-green-700 font-bold" : "text-gray-700 group-hover:text-green-700"
                  }`}
                >
                  {sub.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting & Filters Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <span className="text-xs text-gray-500">
          Showing <strong className="text-gray-900">{filteredProducts.length}</strong> products
        </span>

        <div className="flex items-center gap-2">
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="py-1.5 px-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 font-medium"
          >
            <option value="all">All Prices</option>
            <option value="under50k">Under 50,000 UGX</option>
            <option value="50k-150k">50k - 150k UGX</option>
            <option value="above150k">Above 150k UGX</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-1.5 px-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 font-medium"
          >
            <option value="popular">Popularity</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid — SHEIN Style */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center my-6">
          <p className="text-sm font-bold text-gray-900 mb-1">
            No products currently in this subcategory
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Check back soon as local Ugandan makers restock their inventory.
          </p>
          <button
            onClick={() => {
              setSelectedSub("all");
              setPriceRange("all");
            }}
            className="px-4 py-2 bg-green-700 text-white rounded-lg text-xs font-bold hover:bg-green-800 transition"
          >
            View All {category.name}
          </button>
        </div>
      )}
    </main>
  );
}

export default function CategoryClient() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-gray-500">Loading category products...</div>}>
        <CategoryContent />
      </Suspense>
      <Footer />
      <BottomNavigation />
    </div>
  );
}
