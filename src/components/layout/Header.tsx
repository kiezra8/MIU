"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Store, 
  Headphones, 
  SlidersHorizontal,
  ChevronDown,
  X,
  ShieldCheck,
  TrendingUp,
  Clock,
  MessageCircle
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { PRODUCTS, CATEGORIES, SELLERS } from "@/lib/data/store";

export const Header: React.FC = () => {
  const router = useRouter();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user, role, switchRole, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter suggestions
  const matchingProducts = searchQuery.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingCategories = searchQuery.trim()
    ? CATEGORIES.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 2)
    : [];

  const matchingSellers = searchQuery.trim()
    ? SELLERS.filter((s) =>
        s.business_name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 2)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&cat=${selectedCategory}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Utility Banner */}
      <div className="bg-[#111827] text-white text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
              <ShieldCheck size={13} />
              100% Genuine Ugandan Products
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-300">
              Nationwide Delivery across all Districts • MTN & Airtel MoMo Accepted
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Role Switcher for seamless testing */}
            <div className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-0.5 rounded text-[11px]">
              <span className="text-gray-400">Mode:</span>
              <button
                onClick={() => switchRole("customer")}
                className={`px-1.5 py-0.5 rounded transition ${
                  role === "customer" ? "bg-emerald-600 text-white font-semibold" : "text-gray-300 hover:text-white"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => switchRole("seller")}
                className={`px-1.5 py-0.5 rounded transition ${
                  role === "seller" ? "bg-emerald-600 text-white font-semibold" : "text-gray-300 hover:text-white"
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => switchRole("admin")}
                className={`px-1.5 py-0.5 rounded transition ${
                  role === "admin" ? "bg-emerald-600 text-white font-semibold" : "text-gray-300 hover:text-white"
                }`}
              >
                Admin
              </button>
            </div>

            <Link href="/support" className="text-gray-300 hover:text-white flex items-center gap-1 transition">
              <Headphones size={12} />
              Help & Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 flex flex-col items-center justify-center text-white font-black shadow-sm group-hover:bg-emerald-800 transition">
              <span className="text-sm tracking-tighter leading-none">MIU</span>
              <div className="flex gap-0.5 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-black"></span>
                <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
                <span className="w-1 h-1 rounded-full bg-red-600"></span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 leading-none">
                MIU<span className="text-emerald-700">.</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
                Made In Uganda
              </span>
            </div>
          </Link>

          {/* Desktop Prominent Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex w-full">
              {/* Category selector */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-11 pl-3 pr-8 bg-gray-50 border border-r-0 border-gray-300 text-xs font-medium text-gray-700 rounded-l-lg focus:outline-none focus:bg-white cursor-pointer appearance-none"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-3.5 text-gray-500 pointer-events-none" />
              </div>

              {/* Input field */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search authentic Ugandan products, brands, artisans..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full h-11 pl-4 pr-10 text-sm border border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Search button in Ugandan Green */}
              <button
                type="submit"
                className="h-11 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-r-lg flex items-center justify-center gap-1.5 transition shrink-0"
              >
                <Search size={17} />
                <span>Search</span>
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3 max-h-96 overflow-y-auto">
                {searchQuery.trim() ? (
                  <div>
                    {matchingProducts.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <TrendingUp size={12} /> Products
                        </div>
                        {matchingProducts.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition"
                          >
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {p.name}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 ml-2 shrink-0">
                              UGX {p.price_ugx.toLocaleString()}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {matchingCategories.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Categories
                        </div>
                        {matchingCategories.map((c) => (
                          <Link
                            key={c.id}
                            href={`/categories/${c.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="block p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition"
                          >
                            Browse <span className="font-semibold text-gray-900">{c.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {matchingSellers.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Store size={12} /> Ugandan Stores
                        </div>
                        {matchingSellers.map((s) => (
                          <Link
                            key={s.id}
                            href={`/stores/${s.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="block p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition"
                          >
                            <span className="font-semibold text-gray-900">{s.business_name}</span> ({s.district})
                          </Link>
                        ))}
                      </div>
                    )}

                    {matchingProducts.length === 0 && matchingCategories.length === 0 && matchingSellers.length === 0 && (
                      <div className="text-center py-4 text-sm text-gray-500">
                        No matches found for &quot;{searchQuery}&quot;. Try &quot;Coffee&quot;, &quot;Kitenge&quot;, or &quot;Shea Butter&quot;.
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Clock size={12} /> Popular Ugandan Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Mount Elgon Coffee", "Handmade Baskets", "Kitenge Dress", "Nilotica Shea", "Raw Honey", "Leather Tote"].map(
                        (term) => (
                          <button
                            key={term}
                            onClick={() => {
                              setSearchQuery(term);
                              router.push(`/search?q=${encodeURIComponent(term)}`);
                              setIsSearchOpen(false);
                            }}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full text-gray-700 transition"
                          >
                            {term}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Navigation Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-emerald-700 rounded-lg hover:bg-gray-100 transition"
              aria-label="Search"
            >
              <Search size={21} />
            </button>

            {/* Live WhatsApp Chat Button */}
            <Link
              href="/chat"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-[#075E54] hover:bg-[#008069] text-white transition shadow-xs"
              title="Chat & Order with Support"
            >
              <MessageCircle size={15} />
              <span>Live Chat</span>
            </Link>

            {/* Sell on MIU button */}
            <Link
              href={role === "seller" ? "/seller/dashboard" : "/seller/register"}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-700 text-emerald-800 hover:bg-emerald-50 transition"
            >
              <Store size={15} />
              <span>{role === "seller" ? "Seller Dashboard" : "Sell on MIU"}</span>
            </Link>

            {/* Admin link if role is admin */}
            {role === "admin" && (
              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                <SlidersHorizontal size={14} />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-gray-700 hover:text-emerald-700 rounded-lg hover:bg-gray-100 transition"
              aria-label="Wishlist"
            >
              <Heart size={21} />
              {totalWishlistItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart Icon with Live Numerical Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-emerald-700 rounded-lg hover:bg-gray-100 transition flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={21} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-emerald-700 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account / Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                aria-label="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xs">
                  {user?.full_name ? user.full_name[0] : <User size={16} />}
                </div>
                <span className="hidden sm:inline-block text-xs font-medium text-gray-900 truncate max-w-[90px]">
                  {user ? user.full_name.split(" ")[0] : "Account"}
                </span>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.full_name || "Guest"}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                      Role: {role}
                    </span>
                  </div>

                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                  >
                    My Account & Orders
                  </Link>

                  <Link
                    href="/account/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                  >
                    My Wishlist ({totalWishlistItems})
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Settings
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <Link
                    href="/seller/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-emerald-800 font-medium hover:bg-emerald-50 transition"
                  >
                    Seller Center
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-gray-900 font-medium hover:bg-gray-100 transition"
                  >
                    Admin Dashboard
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition text-xs font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay Form */}
        {isMobileSearchOpen && (
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                placeholder="Search Made in Uganda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:border-emerald-700"
              />
              <button
                type="submit"
                className="px-4 bg-emerald-700 text-white rounded-r-lg flex items-center justify-center"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};
