"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Store, 
  Truck, 
  Check, 
  X 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatUGX } from "@/lib/utils/formatters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    totalPayable,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Group cart items by seller for multi-vendor transparency
  const itemsBySeller: Record<string, typeof cart> = {};
  cart.forEach((item) => {
    const sellerName = item.product.seller?.business_name || "Ugandan Artisan / Seller";
    if (!itemsBySeller[sellerName]) {
      itemsBySeller[sellerName] = [];
    }
    itemsBySeller[sellerName].push(item);
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback(res);
    if (res.success) {
      setInputCoupon("");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShoppingCart size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Your Shopping Cart
              </h1>
              <p className="text-xs text-gray-500">
                {cart.length > 0
                  ? `${cart.length} authentic Ugandan items ready for checkout`
                  : "Your cart is currently empty"}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 transition"
            >
              <Trash2 size={13} /> Clear Cart
            </button>
          )}
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List - Grouped by Seller (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {Object.entries(itemsBySeller).map(([sellerName, items]) => (
                <div
                  key={sellerName}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs"
                >
                  {/* Seller Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store size={16} className="text-emerald-700" />
                      <span className="font-bold text-xs sm:text-sm text-gray-900">
                        Vendor: {sellerName}
                      </span>
                      <ShieldCheck size={14} className="text-emerald-700" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Fulfilled in Uganda
                    </span>
                  </div>

                  {/* Items from this seller */}
                  <div className="divide-y divide-gray-100 p-4 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 first:pt-0"
                      >
                        {/* Image & Title */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                            <Image
                              src={item.product.images[0]?.image_url || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-bold text-xs sm:text-sm text-gray-900 hover:text-emerald-800 transition line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              Origin: {item.product.district}, Uganda
                            </p>

                            {/* Selected Variant Display */}
                            {item.selected_variant && Object.keys(item.selected_variant).length > 0 && (
                              <div className="flex gap-1.5 mt-1 flex-wrap">
                                {Object.entries(item.selected_variant).map(([k, v]) => (
                                  <span
                                    key={k}
                                    className="px-1.5 py-0.5 bg-gray-100 text-[10px] font-semibold text-gray-600 rounded"
                                  >
                                    {k}: {v}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="text-xs font-black text-gray-900 mt-1 sm:hidden">
                              {formatUGX(item.unit_price_ugx)}
                            </div>
                          </div>
                        </div>

                        {/* Price, Quantity Adjuster & Total */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          <span className="hidden sm:block text-xs font-bold text-gray-900 min-w-[85px] text-right">
                            {formatUGX(item.unit_price_ugx)}
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-gray-900 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs sm:text-sm font-black text-emerald-800 min-w-[95px] text-right">
                            {formatUGX(item.total_price_ugx)}
                          </span>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout Card (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs sticky top-24">
                <h3 className="font-black text-base text-gray-900 pb-3 border-b border-gray-200 mb-4">
                  Order Summary
                </h3>

                {/* Coupon Code Input */}
                <div className="mb-4">
                  <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. MIU2026)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg uppercase font-mono focus:outline-none focus:border-emerald-700"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition"
                    >
                      Apply
                    </button>
                  </form>

                  {couponCode && (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5 mt-2 text-xs">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <Tag size={12} /> Coupon &apos;{couponCode}&apos; Applied
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {couponFeedback && !couponCode && (
                    <p className={`text-[11px] mt-1 ${couponFeedback.success ? "text-emerald-700" : "text-red-600"}`}>
                      {couponFeedback.message}
                    </p>
                  )}
                </div>

                {/* Financial Breakdown */}
                <div className="space-y-2 text-xs text-gray-600 py-3 border-t border-b border-gray-100">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-gray-900">{formatUGX(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Promotional Discount:</span>
                      <span>-{formatUGX(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck size={12} /> Delivery:
                    </span>
                    <span className="text-gray-500 italic">Calculated at checkout</span>
                  </div>
                </div>

                {/* Total Payable */}
                <div className="flex items-baseline justify-between pt-3 pb-5">
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">Total Payable:</span>
                    <span className="text-[10px] text-gray-400">Exclusive of delivery</span>
                  </div>
                  <span className="text-xl font-black text-emerald-800">
                    {formatUGX(totalPayable)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={17} />
                </button>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
                  <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
                  <span>Secure MTN & Airtel Mobile Money Escrow</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
              <ShoppingCart size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Your Shopping Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
              Discover authentic Ugandan handcrafted items, coffee, kitenge fashion, and locally manufactured products.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
            >
              <span>Start Shopping Ugandan Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
