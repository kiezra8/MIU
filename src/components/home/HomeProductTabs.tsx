"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { TrendingUp, Grid, Zap, Timer, MapPin } from "lucide-react";
import { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/ProductCard";
import { AllProductsCatalog } from "@/components/home/AllProductsCatalog";
import { UGANDA_REGIONS, UGANDAN_DISTRICTS } from "@/lib/data/store";

interface HomeProductTabsProps {
  products: Product[];
}

export const HomeProductTabs: React.FC<HomeProductTabsProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<"trending" | "all" | "discounts">("trending");

  // Region and District state for local manufacturing filter
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  // Available districts based on selected region
  const availableDistricts = useMemo(() => {
    if (selectedRegion === "all") return UGANDAN_DISTRICTS;
    const regionObj = UGANDA_REGIONS.find((r) => r.name === selectedRegion);
    return regionObj ? [...regionObj.districts].sort() : UGANDAN_DISTRICTS;
  }, [selectedRegion]);

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    if (newRegion !== "all") {
      const regionObj = UGANDA_REGIONS.find((r) => r.name === newRegion);
      if (regionObj && !regionObj.districts.includes(selectedDistrict)) {
        setSelectedDistrict("all");
      }
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    if (newDistrict !== "all") {
      const regionObj = UGANDA_REGIONS.find((r) => r.districts.includes(newDistrict));
      if (regionObj && selectedRegion === "all") {
        setSelectedRegion(regionObj.name);
      }
    }
  };

  const handleResetLocation = () => {
    setSelectedRegion("all");
    setSelectedDistrict("all");
  };

  // Helper to filter products by district / region with nearby manufacturer fallback
  const filterByLocation = useCallback((productList: Product[]) => {
    if (selectedDistrict !== "all") {
      const target = selectedDistrict.toLowerCase();
      const direct = productList.filter((p) => {
        const d = (p.district || "").toLowerCase();
        const loc = (p.production_location || "").toLowerCase();
        return d === target || loc.includes(target);
      });
      if (direct.length > 0) {
        return { items: direct, isNearby: false };
      }

      // Nearby fallback: filter by the district's region
      const regionObj = UGANDA_REGIONS.find((r) => r.districts.includes(selectedDistrict));
      if (regionObj) {
        const nearby = productList.filter((p) => {
          const d = (p.district || "").toLowerCase();
          const loc = (p.production_location || "").toLowerCase();
          return regionObj.districts.some((dist) => {
            const dl = dist.toLowerCase();
            return d === dl || loc.includes(dl);
          });
        });
        if (nearby.length > 0) {
          return { items: nearby, isNearby: true };
        }
      }

      // If still none, fallback to all with nearby suggestion notice
      return { items: productList, isNearby: true };
    }

    if (selectedRegion !== "all") {
      const regionObj = UGANDA_REGIONS.find((r) => r.name === selectedRegion);
      if (regionObj) {
        const regional = productList.filter((p) => {
          const d = (p.district || "").toLowerCase();
          const loc = (p.production_location || "").toLowerCase();
          return regionObj.districts.some((dist) => {
            const dl = dist.toLowerCase();
            return d === dl || loc.includes(dl);
          });
        });
        if (regional.length > 0) {
          return { items: regional, isNearby: false };
        }
      }
      return { items: productList, isNearby: true };
    }

    return { items: productList, isNearby: false };
  }, [selectedRegion, selectedDistrict]);

  // Filtered sets
  const allTrending = useMemo(
    () => products.filter((p) => p.is_trending || p.sales_count > 100),
    [products]
  );
  const allDiscounts = useMemo(
    () => products.filter((p) => p.is_flash_sale || (p.discount_percentage && p.discount_percentage > 0)),
    [products]
  );

  const trendingResult = useMemo(
    () => filterByLocation(allTrending),
    [allTrending, filterByLocation]
  );
  const allProductsResult = useMemo(
    () => filterByLocation(products),
    [products, filterByLocation]
  );
  const discountResult = useMemo(
    () => filterByLocation(allDiscounts),
    [allDiscounts, filterByLocation]
  );

  // Live countdown timer for discounts
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 36, seconds: 42 });

  useEffect(() => {
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
    <section className="my-6">
      {/* ── Small Location Selector below Categories ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 sm:px-4 bg-gray-50 border border-gray-200 rounded-xl mb-5 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-100 text-green-800 rounded-lg">
            <MapPin size={15} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-gray-900 uppercase tracking-tight text-[11px] sm:text-xs">
              Location:
            </span>
            <span className="text-gray-500 hidden sm:inline text-[11px]">
              Shop products manufactured in your area
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Region Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-gray-500 font-medium text-[11px]">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="py-1 px-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-green-700 cursor-pointer"
            >
              <option value="all">All Uganda</option>
              {UGANDA_REGIONS.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown with all Ugandan districts */}
          <div className="flex items-center gap-1">
            <span className="text-gray-500 font-medium text-[11px]">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="py-1 px-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-green-700 max-w-[150px] sm:max-w-[190px] cursor-pointer"
            >
              <option value="all">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {(selectedRegion !== "all" || selectedDistrict !== "all") && (
            <button
              type="button"
              onClick={handleResetLocation}
              className="text-[11px] font-bold text-gray-500 hover:text-red-600 transition px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Section Tabs Switcher (Clean labels without numbers) ── */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-gray-200 mb-5 overflow-x-auto no-scrollbar pb-1">
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
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "trending" && (
        <div>
          {/* Nearby Suggestions Banner if district has no direct items */}
          {trendingResult.isNearby && (selectedDistrict !== "all" || selectedRegion !== "all") && (
            <div className="mb-4 p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
              <MapPin size={15} className="text-amber-700 shrink-0" />
              <span>
                {selectedDistrict !== "all"
                  ? `No direct products manufactured in ${selectedDistrict} yet — showing suggested products from nearby Ugandan makers:`
                  : `Showing suggested authentic products from nearby makers in the ${selectedRegion} region:`}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {trendingResult.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "all" && (
        <div>
          {allProductsResult.isNearby && (selectedDistrict !== "all" || selectedRegion !== "all") && (
            <div className="mb-4 p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
              <MapPin size={15} className="text-amber-700 shrink-0" />
              <span>
                {selectedDistrict !== "all"
                  ? `No direct products manufactured in ${selectedDistrict} yet — showing suggested products from nearby Ugandan makers:`
                  : `Showing suggested authentic products from nearby makers in the ${selectedRegion} region:`}
              </span>
            </div>
          )}
          <AllProductsCatalog initialProducts={allProductsResult.items} />
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

          {discountResult.isNearby && (selectedDistrict !== "all" || selectedRegion !== "all") && (
            <div className="mb-4 p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
              <MapPin size={15} className="text-amber-700 shrink-0" />
              <span>
                {selectedDistrict !== "all"
                  ? `No direct products manufactured in ${selectedDistrict} yet — showing suggested products from nearby Ugandan makers:`
                  : `Showing suggested authentic products from nearby makers in the ${selectedRegion} region:`}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {discountResult.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
