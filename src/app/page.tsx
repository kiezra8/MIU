"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { FlashSales } from "@/components/home/FlashSales";
import { NewArrivals } from "@/components/home/NewArrivals";
import { AllProductsCatalog } from "@/components/home/AllProductsCatalog";
import { mockDb } from "@/lib/data/mockDb";

export default function HomePage() {
  const products = mockDb.getProducts();

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-green-100 selection:text-green-900">
      {/* MAIN HEADER */}
      <Header />

      <main className="flex-1 w-full">
        {/* HERO CAROUSEL — full-width, no horizontal padding */}
        <HeroCarousel />

        <div className="max-w-7xl mx-auto px-3 sm:px-5">
          {/* CATEGORIES — SHEIN-style horizontal scroll */}
          <CategoryGrid />

          {/* TRENDING PRODUCTS */}
          <TrendingProducts products={products} />

          {/* FLASH SALES */}
          <FlashSales products={products} />

          {/* NEW ARRIVALS */}
          <NewArrivals products={products} />

          {/* ALL PRODUCTS (Complete Catalogue) */}
          <AllProductsCatalog initialProducts={products} />
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FIXED BOTTOM NAVIGATION */}
      <BottomNavigation />
    </div>
  );
}
