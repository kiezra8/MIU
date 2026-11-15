"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Mic, Sparkles, X } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/data/store";
import { ProductCard } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { translateLocalQuery } from "@/lib/utils/localLanguageTranslator";
import { VoiceSearchModal } from "@/components/layout/VoiceSearchModal";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const origParam = searchParams.get("orig") || "";
  const initialCategory = searchParams.get("cat") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Auto-translate query if typed in Luganda, Swahili, or other local language
  const translation = useMemo(() => translateLocalQuery(query), [query]);

  const results = useMemo(() => {
    let list = [...PRODUCTS];

    if (query.trim()) {
      const qOriginal = query.toLowerCase();
      const qTranslated = translation.translated.toLowerCase();
      const origLow = origParam.toLowerCase();
      const tokens = [
        ...qTranslated.split(" "),
        ...qOriginal.split(" "),
      ].filter((t) => t.length > 2);

      list = list.filter((p) => {
        const name = p.name.toLowerCase();
        const shortDesc = p.short_description.toLowerCase();
        const fullDesc = p.full_description.toLowerCase();
        const cat = (p.category_name || "").toLowerCase();
        const sub = (p.subcategory_name || "").toLowerCase();
        const loc = p.production_location.toLowerCase();
        const dist = p.district.toLowerCase();

        return (
          name.includes(qOriginal) ||
          cat.includes(qOriginal) ||
          name.includes(qTranslated) ||
          cat.includes(qTranslated) ||
          shortDesc.includes(qTranslated) ||
          fullDesc.includes(qTranslated) ||
          sub.includes(qTranslated) ||
          (origLow && (name.includes(origLow) || cat.includes(origLow))) ||
          loc.includes(qOriginal) ||
          dist.includes(qOriginal) ||
          tokens.some((tok) => name.includes(tok) || cat.includes(tok) || shortDesc.includes(tok))
        );
      });
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
  }, [query, translation, origParam, selectedCategory, selectedOrigin, sortBy]);

  const handleVoiceSearchResult = (finalQuery: string, _originalQuery: string) => {
    setQuery(finalQuery);
    setIsVoiceModalOpen(false);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
      {/* Search Bar & Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 items-stretch"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search in English, Luganda, or Swahili (e.g. engatto, emmwanyi, coffee)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-700"
            />
            <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />

            <div className="absolute right-3 top-2 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              )}
              {/* Voice search button */}
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-1 text-emerald-700 hover:bg-emerald-50 rounded-full transition"
                title="Voice Search in Any Language"
              >
                <Mic size={17} />
              </button>
            </div>
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

        {/* Quick local language tags */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 overflow-x-auto no-scrollbar">
          <span className="font-semibold text-gray-700 shrink-0">Try searching:</span>
          {[
            { label: "Engatto (Shoes)", query: "engatto" },
            { label: "Emmwanyi (Coffee)", query: "emmwanyi" },
            { label: "Omukeeka (Woven Mats)", query: "omukeeka" },
            { label: "Mubisi gwenjuki (Honey)", query: "mubisi gwenjuki" },
            { label: "Ebizigo (Shea Butter)", query: "ebizigo" },
            { label: "Kitenge Dresses", query: "kitenge" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setQuery(item.query)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200 rounded-full shrink-0 transition font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Translation Banner when query is translated from a local language */}
      {(translation.isTranslated || origParam) && (
        <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-green-950">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-green-700 shrink-0" />
            <span>
              Searching for translated term:{" "}
              <strong className="text-green-950 font-black">&ldquo;{translation.translated}&rdquo;</strong>{" "}
              <span className="text-gray-600">
                (Auto-translated from {translation.detectedLanguage || "local language"}: &ldquo;{origParam || query}&rdquo;)
              </span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-black bg-green-700 text-white px-2 py-0.5 rounded-full self-start sm:self-auto shrink-0">
            Auto-Translated
          </span>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-200">
        <h1 className="text-base sm:text-lg font-black text-gray-900">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center max-w-lg mx-auto my-8">
          <p className="text-base font-bold text-gray-900 mb-2">No matching products found</p>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            We couldn&apos;t find any items matching &quot;{query}&quot;. Try searching in English, Luganda (e.g. &quot;engatto&quot;, &quot;emmwanyi&quot;), or Swahili (e.g. &quot;viatu&quot;, &quot;kahawa&quot;).
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

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={handleVoiceSearchResult}
      />
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
