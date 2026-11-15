"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  MessageSquare, 
  ChevronRight, 
  TrendingUp, 
  Sparkles 
} from "lucide-react";
import { SELLERS, PRODUCTS } from "@/lib/data/store";
import { ProductCard } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function StorefrontClient() {
  const params = useParams();
  const slug = params?.slug as string;

  const seller = SELLERS.find((s) => s.slug === slug) || SELLERS[0];
  const sellerProducts = PRODUCTS.filter((p) => p.seller_id === seller.id);

  const [activeTab, setActiveTab] = useState<"all" | "best_sellers" | "new_arrivals" | "about">("all");

  const displayedProducts = () => {
    switch (activeTab) {
      case "best_sellers":
        return [...sellerProducts].sort((a, b) => b.sales_count - a.sales_count);
      case "new_arrivals":
        return [...sellerProducts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return sellerProducts;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-green-800 transition">
            Home
          </Link>
          <ChevronRight size={13} />
          <span className="text-gray-500">Ugandan Sellers</span>
          <ChevronRight size={13} />
          <span className="text-gray-900 font-semibold">{seller.business_name}</span>
        </nav>

        {/* Storefront Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 mb-6 shadow-sm">
          {/* Banner Image */}
          <div className="relative h-44 sm:h-64 w-full">
            <Image
              src={seller.banner_url}
              alt={seller.business_name}
              fill
              className="object-cover opacity-85"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Floating Details Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md shrink-0">
                <Image
                  src={seller.logo_url}
                  alt={seller.business_name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {seller.business_name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-300 bg-green-950/80 px-2 py-0.5 rounded-full border border-green-500/40 backdrop-blur-xs">
                    <ShieldCheck size={13} />
                    Verified Made in Uganda
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-300 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-green-400" />
                    {seller.business_location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    <strong>{seller.rating}</strong> ({seller.rating_count} reviews)
                  </span>
                  <span>•</span>
                  <span>{sellerProducts.length} Ugandan Products</span>
                </div>
              </div>
            </div>

            {/* Direct Contact WhatsApp CTA */}
            {seller.whatsapp_number && (
              <a
                href={`https://wa.me/${seller.whatsapp_number.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(seller.business_name)}%2C%20I%20saw%20your%20storefront%20on%20MIU`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl shadow-md transition self-start sm:self-auto shrink-0"
              >
                <MessageSquare size={15} />
                <span>Chat with Vendor</span>
              </a>
            )}
          </div>
        </div>

        {/* Storefront Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === "all"
                ? "border-green-700 text-green-800"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            All Products ({sellerProducts.length})
          </button>

          <button
            onClick={() => setActiveTab("best_sellers")}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "best_sellers"
                ? "border-green-700 text-green-800"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <TrendingUp size={14} /> Best Sellers
          </button>

          <button
            onClick={() => setActiveTab("new_arrivals")}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "new_arrivals"
                ? "border-green-700 text-green-800"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <Sparkles size={14} /> New Arrivals
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === "about"
                ? "border-green-700 text-green-800"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            About Artisan / Maker
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "about" ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-3xl space-y-4 text-xs leading-relaxed">
            <h3 className="text-base font-black text-gray-900">
              The Story of {seller.business_name}
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              {seller.business_description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Director / Founder</span>
                <span className="font-bold text-sm text-gray-900">{seller.owner_name}</span>
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Production Region</span>
                <span className="font-bold text-sm text-gray-900">{seller.business_location}</span>
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Registration / TIN</span>
                <span className="font-bold text-sm text-gray-900">{seller.registration_number || "Certified Local Cooperative"}</span>
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Origin Type</span>
                <span className="font-bold text-sm text-green-800 uppercase">{seller.origin_type.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {displayedProducts().length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {displayedProducts().map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                <p className="text-sm font-bold text-gray-900">No products uploaded under this section yet.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
