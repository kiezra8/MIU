"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  MessageCircle,
  Mic,
  Sparkles
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { PRODUCTS, CATEGORIES, SELLERS } from "@/lib/data/store";
import { translateWithFreeAI } from "@/lib/utils/aiSearchAssistant";
import { VoiceSearchModal } from "@/components/layout/VoiceSearchModal";

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
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [aiTranslatedText, setAiTranslatedText] = useState("");
  const [detectedLang, setDetectedLang] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Auto-translate user local language input using free AI
  useEffect(() => {
    if (!searchQuery.trim()) {
      setAiTranslatedText("");
      setDetectedLang("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const res = await translateWithFreeAI(searchQuery);
        if (res.translated && res.translated.toLowerCase() !== searchQuery.toLowerCase().trim()) {
          setAiTranslatedText(res.translated);
          setDetectedLang(res.detectedLanguage);
        } else {
          setAiTranslatedText("");
          setDetectedLang("");
        }
      } catch {
        // Keep smooth fallback
      } finally {
        setIsTranslating(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle voice search result from AI VoiceSearchModal
  const handleVoiceSearchResult = (finalQuery: string, originalQuery: string) => {
    setSearchQuery(finalQuery);
    setIsVoiceModalOpen(false);
    setIsMobileSearchOpen(false);
    setIsSearchOpen(false);
    router.push(
      `/search?q=${encodeURIComponent(finalQuery)}&orig=${encodeURIComponent(originalQuery)}`
    );
  };

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

  // Filter live suggestions matching original input or translated English terms
  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const qOriginal = searchQuery.toLowerCase();
    const qTranslated = aiTranslatedText ? aiTranslatedText.toLowerCase() : "";
    const tokens = [
      ...qOriginal.split(" "),
      ...(qTranslated ? qTranslated.split(" ") : []),
    ].filter((t) => t.length > 2);

    return PRODUCTS.filter((p) => {
      const name = p.name.toLowerCase();
      const cat = (p.category_name || "").toLowerCase();
      const desc = (p.short_description || "").toLowerCase();
      const sub = (p.subcategory_name || "").toLowerCase();

      return (
        name.includes(qOriginal) ||
        cat.includes(qOriginal) ||
        (qTranslated && (name.includes(qTranslated) || cat.includes(qTranslated) || desc.includes(qTranslated) || sub.includes(qTranslated))) ||
        tokens.some((t) => name.includes(t) || cat.includes(t))
      );
    }).slice(0, 4);
  }, [searchQuery, aiTranslatedText]);

  const matchingCategories = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const qOriginal = searchQuery.toLowerCase();
    const qTranslated = aiTranslatedText ? aiTranslatedText.toLowerCase() : "";
    return CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(qOriginal) ||
        (qTranslated && c.name.toLowerCase().includes(qTranslated))
    ).slice(0, 2);
  }, [searchQuery, aiTranslatedText]);

  const matchingSellers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const qOriginal = searchQuery.toLowerCase();
    return SELLERS.filter((s) =>
      s.business_name.toLowerCase().includes(qOriginal)
    ).slice(0, 2);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);

    // If query was in a local language, search by translated English product keywords
    const finalTarget = aiTranslatedText || searchQuery.trim();
    router.push(
      `/search?q=${encodeURIComponent(finalTarget)}&orig=${encodeURIComponent(searchQuery.trim())}&cat=${selectedCategory}`
    );
  };

  return (
    <>
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
                Nationwide Delivery across all Districts • MTN &amp; Airtel MoMo Accepted
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Role Switcher */}
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
                Help &amp; Support
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

                {/* Input field with AI Voice & Multilingual Translation */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search in English, Luganda, or Swahili (e.g. engatto, emmwanyi, coffee)..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-full h-11 pl-4 pr-20 text-sm border border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition"
                  />

                  <div className="absolute right-2.5 top-2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Clear"
                      >
                        <X size={15} />
                      </button>
                    )}

                    {/* AI Voice Search in Any Language */}
                    <button
                      type="button"
                      onClick={() => setIsVoiceModalOpen(true)}
                      className="p-1.5 rounded-full text-emerald-700 hover:bg-emerald-50 transition-all"
                      title="AI Voice Search in Any Language (Luganda, Swahili, English)"
                    >
                      <Mic size={18} className="hover:scale-110 transition-transform" />
                    </button>
                  </div>
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
                  {/* AI Translation Indicator */}
                  {aiTranslatedText && (
                    <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-xs text-green-950">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={14} className="text-green-700 shrink-0" />
                        <span>
                          AI Translated from <strong>{detectedLang || "local language"}</strong>:{" "}
                          <strong className="text-green-950 font-black">&ldquo;{aiTranslatedText}&rdquo;</strong>
                        </span>
                      </div>
                      <span className="text-[10px] bg-green-700 text-white font-black px-1.5 py-0.5 rounded uppercase">
                        AI Translated
                      </span>
                    </div>
                  )}

                  {isTranslating && !aiTranslatedText && (
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mb-2 px-1">
                      <Sparkles size={12} className="animate-spin text-green-600" />
                      <span>AI translating query...</span>
                    </div>
                  )}

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
                              className="block p-2 hover:bg-gray-50 rounded-md text-sm text-gray-700 font-medium transition"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      {matchingSellers.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Verified Ugandan Makers
                          </div>
                          {matchingSellers.map((s) => (
                            <Link
                              key={s.id}
                              href={`/stores/${s.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition"
                            >
                              <span className="text-sm text-gray-700">{s.business_name}</span>
                              <span className="text-xs text-gray-400">{s.district}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {matchingProducts.length === 0 && matchingCategories.length === 0 && (
                        <p className="text-xs text-gray-500 py-3 text-center">
                          Press Enter to search for &ldquo;{aiTranslatedText || searchQuery}&rdquo;
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Popular Ugandan Searches
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Arabica Coffee",
                          "Engatto (Shoes)",
                          "Kitenge Dresses",
                          "Handwoven Baskets",
                          "Emmwanyi",
                          "Nilotica Shea Butter",
                          "Cowhide Bags",
                          "Omukeeka",
                          "Raw Honey",
                        ].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setSearchQuery(term);
                              router.push(`/search?q=${encodeURIComponent(term)}`);
                              setIsSearchOpen(false);
                            }}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full text-gray-700 transition"
                          >
                            {term}
                          </button>
                        ))}
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
                title="Chat &amp; Order with Support"
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

              {/* Account Dropdown */}
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
                      My Account &amp; Orders
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

          {/* Mobile Search Overlay Form with AI Voice Search */}
          {isMobileSearchOpen && (
            <div className="mt-3 md:hidden">
              <form onSubmit={handleSearchSubmit} className="flex relative">
                <input
                  type="text"
                  placeholder="Search in English, Luganda, or Swahili..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full h-10 pl-3 pr-20 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:border-emerald-700"
                />

                <div className="absolute right-12 top-1.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                  {/* Mobile AI Voice Search Mic */}
                  <button
                    type="button"
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="p-1.5 rounded-full text-emerald-700 hover:bg-emerald-50 transition"
                    title="AI Voice Search in Any Language"
                  >
                    <Mic size={17} />
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-4 bg-emerald-700 text-white rounded-r-lg flex items-center justify-center shrink-0"
                >
                  <Search size={18} />
                </button>
              </form>

              {aiTranslatedText && (
                <div className="text-[11px] bg-green-50 border border-green-200 text-green-900 font-semibold mt-1 px-2 py-1 rounded-md flex items-center gap-1">
                  <Sparkles size={13} className="text-green-700 shrink-0" />
                  <span>
                    AI Translating: <strong>&ldquo;{aiTranslatedText}&rdquo;</strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* AI Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={handleVoiceSearchResult}
      />
    </>
  );
};
