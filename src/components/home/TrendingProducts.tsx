"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/ProductCard";

interface TrendingProductsProps {
  products: Product[];
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trendingList = products.filter((p) => p.is_trending || p.sales_count > 100);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const amount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - amount : scrollLeft + amount,
        behavior: "smooth",
      });
    }
  };

  if (trendingList.length === 0) return null;

  return (
    <section className="my-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight">
            🔥 Trending Now
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">Most loved items across Uganda</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1"
      >
        {trendingList.map((product) => (
          <div key={product.id} className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
