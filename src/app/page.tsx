"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HomeProductTabs } from "@/components/home/HomeProductTabs";
import { mockDb } from "@/lib/data/mockDb";

export default function HomePage() {
  const products = mockDb.getProducts();

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-green-100 selection:text-green-900">
      {/* MAIN HEADER */}
      <Header />

      <main className="flex-1 w-full">
        {/* HERO CAROUSEL */}
        <HeroCarousel />

        <div className="max-w-7xl mx-auto px-3 sm:px-5">
          {/* 10 CATEGORIES — 5 by 2 square cards with round borders */}
          <CategoryGrid />

          {/* TABBED SECTIONS: Trending Products, All Products, Discounts */}
          <HomeProductTabs products={products} />
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FIXED BOTTOM NAVIGATION */}
      <BottomNavigation />
    </div>
  );
}
