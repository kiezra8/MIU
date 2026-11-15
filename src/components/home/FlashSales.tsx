"use client";

import React, { useState, useEffect } from "react";
import { Zap, Timer } from "lucide-react";
import { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/ProductCard";

interface FlashSalesProps {
  products: Product[];
}

export const FlashSales: React.FC<FlashSalesProps> = ({ products }) => {
  const flashProducts = products.filter((p) => p.is_flash_sale && p.discount_percentage);

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 36, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section className="my-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-white p-1.5 rounded-lg">
            <Zap size={18} className="fill-current" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              Flash Sales
              <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                Live
              </span>
            </h2>
            <p className="text-[11px] text-gray-500">Limited-time deals on verified Ugandan goods</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Timer size={14} className="text-red-600" />
          <span className="text-[11px] font-semibold text-gray-600">Ends in:</span>
          <div className="flex items-center gap-0.5 font-mono text-xs font-black">
            <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded">
              {String(timeLeft.hours).padStart(2, "0")}h
            </span>
            <span className="text-gray-500">:</span>
            <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, "0")}m
            </span>
            <span className="text-gray-500">:</span>
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
              {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {flashProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
