"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/data/store";
import { ProductCard } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("cat") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  const results = useMemo(() => {
    let list = [...PRODUCTS];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.full_description.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q) ||
          p.subcategory_name?.toLowerCase().includes(q) ||
          p.production_location.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      const cat = CATEGORIES.find((c) => c.slug === selectedCategory);
      if (cat) {
        list = list.filter((p) => p.category_id === cat.id || p.category_name === cat.name);
      }
    }

    if (selectedOrigin !== "all") {
      list = list.filter((p) => p.verification_badge === selectedOrigin);
    }

    switch (sortBy) {
      case "price-low":
        list.sort((a, b) => a.price_ugx - b.price_ugx);
        break;
      case "price-high":
        list.sort((a, b) => b.price_ugx - a.price_ugx);
        break;
      case "popular":
        list.sort((a, b) => b.sales_count - a.sales_count);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        break;
    }

    return list;
  }, [query, selectedCategory, selectedOrigin, sortBy]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
      {/* Search Bar & Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 items-stretch"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products, crafts, designers, food..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-700"
            />
            <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-3 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="all">All 10 Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="py-2.5 px-3 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="all">All Ugandan Origins</option>
            <option value="locally_grown">Locally Grown</option>
            <option value="locally_manufactured">Locally Manufactured</option>
            <option value="handcrafted">Handcrafted Artisan</option>
            <option value="locally_processed">Locally Processed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-2.5 px-3 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="popular">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </form>

        {/* Quick tags */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 overflow-x-auto no-scrollbar">
          <span className="font-semibold text-gray-700 shrink-0">Suggestions:</span>
          {["Mount Elgon Coffee", "Rwenzori Honey", "Kitenge Dress", "Shea Butter", "Handwoven Baskets"].map(
            (term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200 rounded-full shrink-0 transition"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
        <h1 className="text-lg font-black text-gray-900">
          {query ? (
            <>
              Search results for &quot;<span className="text-emerald-800">{query}</span>&quot;
            </>
          ) : (
            "Browse Ugandan Marketplace"
          )}
        </h1>
        <span className="text-xs text-gray-500">
          Found <strong className="text-gray-900">{results.length}</strong> matching products
        </span>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-8">
          <p className="text-base font-bold text-gray-900 mb-2">No matching products found</p>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            We couldn&apos;t find any items matching &quot;{query}&quot;. Try searching for general terms like &quot;Coffee&quot;, &quot;Shoes&quot;, or &quot;Honey&quot;.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
              setSelectedOrigin("all");
            }}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold"
          >
            Reset Search
          </button>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-gray-500">Loading Ugandan search results...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
      <BottomNavigation />
    </div>
  );
}
