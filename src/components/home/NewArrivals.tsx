"use client";

import React from "react";
import { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/ProductCard";

interface NewArrivalsProps {
  products: Product[];
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ products }) => {
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight">
            ✨ New Arrivals
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Fresh additions from local workshops, fields &amp; designers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
