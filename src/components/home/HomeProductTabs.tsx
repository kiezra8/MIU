"use client";

import React, { useState } from "react";
import { TrendingUp, Grid, Zap, Timer } from "lucide-react";
import { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/ProductCard";
import { AllProductsCatalog } from "@/components/home/AllProductsCatalog";

interface HomeProductTabsProps {
  products: Product[];
}

export const HomeProductTabs: React.FC<HomeProductTabsProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<"trending" | "all" | "discounts">("trending");

  const trendingProducts = products.filter((p) => p.is_trending || p.sales_count > 100);
  const discountProducts = products.filter((p) => p.is_flash_sale || (p.discount_percentage && p.discount_percentage > 0));

  // Live countdown timer for discounts
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 36, seconds: 42 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="my-8">
      {/* ── Section Tabs Switcher ── */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab("trending")}
          className={`flex items-center gap-1.5 py-3 px-3 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-tight rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
            activeTab === "trending"
              ? "border-green-700 text-green-800 bg-green-50/60"
              : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
          }`}
        >
          <TrendingUp size={16} className={activeTab === "trending" ? "text-green-700" : "text-gray-400"} />
          <span>Trending Products</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === "trending" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-600"
          }`}>
            {trendingProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 py-3 px-3 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-tight rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
            activeTab === "all"
              ? "border-green-700 text-green-800 bg-green-50/60"
              : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
          }`}
        >
          <Grid size={16} className={activeTab === "all" ? "text-green-700" : "text-gray-400"} />
          <span>All Products</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === "all" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-600"
          }`}>
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("discounts")}
          className={`flex items-center gap-1.5 py-3 px-3 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-tight rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
            activeTab === "discounts"
              ? "border-red-600 text-red-600 bg-red-50/60"
              : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
          }`}
        >
          <Zap size={16} className={activeTab === "discounts" ? "text-red-600 fill-current" : "text-gray-400"} />
          <span>Discounts</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === "discounts" ? "bg-red-600 text-white animate-pulse" : "bg-gray-200 text-gray-600"
          }`}>
            Sale
          </span>
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "trending" && (
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                🔥 Trending Across Uganda
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Top rated and most purchased items this week
              </p>
            </div>
            <span className="text-xs font-bold text-green-700">
              {trendingProducts.length} items
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "all" && (
        <div>
          <AllProductsCatalog initialProducts={products} />
        </div>
      )}

      {activeTab === "discounts" && (
        <div>
          {/* Flash Sale Banner & Countdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-600 text-white rounded-lg shadow-xs">
                <Zap size={18} className="fill-current" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  Special Promotions &amp; Discounts
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                    Live
                  </span>
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Verified authentic Ugandan products at limited-time discount rates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white px-3 py-1.5 rounded-lg border border-red-200 shadow-2xs">
              <Timer size={14} className="text-red-600" />
              <span className="text-xs font-bold text-gray-700">Ends in:</span>
              <div className="flex items-center gap-0.5 font-mono text-xs font-black">
                <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </span>
                <span className="text-gray-400">:</span>
                <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
                <span className="text-gray-400">:</span>
                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {discountProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
