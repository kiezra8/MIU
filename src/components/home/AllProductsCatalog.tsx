"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowUpDown, X } from "lucide-react";
import { Product } from "@/types/marketplace";
import { CATEGORIES } from "@/lib/data/store";
import { ProductCard } from "@/components/product/ProductCard";

interface AllProductsCatalogProps {
  initialProducts: Product[];
}

export const AllProductsCatalog: React.FC<AllProductsCatalogProps> = ({ initialProducts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all"); // 'all' | 'under50k' | '50k-150k' | 'above150k'
  const [sortBy, setSortBy] = useState<string>("popular"); // 'newest' | 'popular' | 'price-low' | 'price-high' | 'discount'
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Selected category object to derive subcategories
  const currentCategoryObj = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === selectedCategory);
  }, [selectedCategory]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        const cat = CATEGORIES.find((c) => c.slug === selectedCategory);
        return p.category_id === cat?.id || p.category_name === cat?.name;
      });
    }

    // 3. Subcategory filter
    if (selectedSubcategory !== "all") {
      result = result.filter((p) => {
        const sub = currentCategoryObj?.subcategories.find((s) => s.slug === selectedSubcategory);
        return p.subcategory_id === sub?.id || p.subcategory_name === sub?.name;
      });
    }

    // 4. Price range filter
    if (priceRange === "under50k") {
      result = result.filter((p) => p.price_ugx < 50000);
    } else if (priceRange === "50k-150k") {
      result = result.filter((p) => p.price_ugx >= 50000 && p.price_ugx <= 150000);
    } else if (priceRange === "above150k") {
      result = result.filter((p) => p.price_ugx > 150000);
    }

    // 5. Sorting
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
  }, [initialProducts, searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy, currentCategoryObj]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setPriceRange("all");
    setSortBy("popular");
    setCurrentPage(1);
  };

  return (
    <section id="all-products" className="my-12">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          All Authentic Ugandan Products
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Explore complete catalogue with nationwide delivery across Uganda
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Live Search inside Catalog */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products in catalogue..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Controls: Price Filter & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 px-3 text-xs border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium focus:outline-none focus:bg-white"
            >
              <option value="all">All Prices</option>
              <option value="under50k">Under UGX 50,000</option>
              <option value="50k-150k">UGX 50,000 - 150,000</option>
              <option value="above150k">Above UGX 150,000</option>
            </select>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-2 bg-gray-50">
              <ArrowUpDown size={14} className="text-gray-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 text-xs bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discounts</option>
              </select>
            </div>

            {/* Clear Filters Button if any active */}
            {(searchTerm || selectedCategory !== "all" || priceRange !== "all") && (
              <button
                onClick={resetFilters}
                className="py-2 px-3 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold transition flex items-center gap-1"
              >
                <X size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* 10 Category Horizontal Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100 pb-1">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSubcategory("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === "all"
                ? "bg-green-700 text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setSelectedSubcategory("all");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.slug
                  ? "bg-green-700 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategories Filter Pills if a category is selected */}
        {currentCategoryObj && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100 bg-gray-50/50 p-2 rounded-lg">
            <span className="text-[11px] font-bold text-gray-500 self-center uppercase tracking-wider mr-1">
              Subcategories:
            </span>
            <button
              onClick={() => {
                setSelectedSubcategory("all");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition ${
                selectedSubcategory === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              All {currentCategoryObj.name}
            </button>
            {currentCategoryObj.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubcategory(sub.slug);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition ${
                  selectedSubcategory === sub.slug
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Results Counter */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 px-1">
        <span>
          Showing <strong className="text-gray-900">{filteredProducts.length}</strong> Ugandan products
        </span>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-base font-bold text-gray-900 mb-1">No products match your criteria</p>
          <p className="text-xs text-gray-500 mb-4">Try clearing filters or searching for another term</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs rounded-lg transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                currentPage === page
                  ? "bg-green-700 text-white shadow-xs"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};
