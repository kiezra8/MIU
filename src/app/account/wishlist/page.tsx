"use client";

import React from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <Heart size={22} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                My Saved Wishlist
              </h1>
              <p className="text-xs text-gray-500">
                {wishlist.length} authentic Ugandan products saved for later
              </p>
            </div>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
            >
              <Trash2 size={14} /> Clear Wishlist
            </button>
          )}
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
              <Heart size={30} />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">Your wishlist is empty</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Explore our marketplace and tap the heart icon on any product to save it here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              <span>Discover Ugandan Products</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
