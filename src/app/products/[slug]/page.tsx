"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Heart, 
  ShoppingCart, 
  Check, 
  Star, 
  ShieldCheck, 
  Store, 
  MapPin, 
  Share2, 
  ArrowLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { PRODUCTS, SELLERS } from "@/lib/data/store";
import { mockDb } from "@/lib/data/mockDb";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatUGX } from "@/lib/utils/formatters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { VerifiedBadge } from "@/components/layout/VerifiedBadge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductReviews } from "@/components/product/ProductReviews";
import { DeliveryEstimator } from "@/components/product/DeliveryEstimator";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const seller = SELLERS.find((s) => s.id === product.seller_id) || SELLERS[0];
  const reviews = mockDb.getReviewsByProductId(product.id);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Variant selections
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants && product.variants.length > 0) {
      // Pick first of each type
      const types = Array.from(new Set(product.variants.map((v) => v.name)));
      types.forEach((t) => {
        const first = product.variants?.find((v) => v.name === t);
        if (first) initial[t] = first.value;
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Related products from same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category_id === product.category_id && p.id !== product.id
  ).slice(0, 4);

  const handleVariantSelect = (variantName: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: value,
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants);
    router.push("/checkout");
  };

  // Group variants by name (e.g. "Size", "Color", "Grind Type")
  const variantGroups: Record<string, typeof product.variants> = {};
  product.variants?.forEach((v) => {
    if (!variantGroups[v.name]) {
      variantGroups[v.name] = [];
    }
    variantGroups[v.name]?.push(v);
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-emerald-800 transition">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link href={`/categories`} className="hover:text-emerald-800 transition">
            {product.category_name || "Categories"}
          </Link>
          <ChevronRight size={13} />
          <span className="text-gray-900 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Gallery (6 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Information, Pricing, Variants & Purchase Actions (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Ugandan Origin & Verification Badge */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <VerifiedBadge badge={product.verification_badge} size="md" />
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-700" />
                  Origin: <strong>{product.production_location}</strong>
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug mb-2">
                {product.name}
              </h1>

              {/* Ratings and Reviews Summary */}
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1 text-gray-900">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{product.rating}</span>
                </div>
                <span>•</span>
                <span className="text-emerald-800 font-semibold">{product.review_count} Customer Reviews</span>
                <span>•</span>
                <span className="text-gray-500">{product.sales_count}+ Sold across Uganda</span>
              </div>

              {/* Price & Discounts Block */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    {formatUGX(product.price_ugx)}
                  </span>
                  {product.compare_at_price_ugx && product.compare_at_price_ugx > product.price_ugx && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {formatUGX(product.compare_at_price_ugx)}
                      </span>
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-black rounded-md">
                        Save {product.discount_percentage}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Price inclusive of Ugandan VAT. Multiple payment methods supported: MTN MoMo, Airtel Money & Cash.
                </p>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                {product.short_description}
              </p>

              {/* Variants Selector */}
              {Object.entries(variantGroups).map(([variantName, variants]) => (
                <div key={variantName} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-800">
                      Select {variantName}:
                    </span>
                    <span className="text-xs font-semibold text-emerald-800">
                      {selectedVariants[variantName]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {variants?.map((v) => {
                      const isSelected = selectedVariants[variantName] === v.value;
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleVariantSelect(variantName, v.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                            isSelected
                              ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                          }`}
                        >
                          {v.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity Selector and Stock Status */}
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <span className="block text-xs font-bold text-gray-800 mb-1.5">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-gray-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.inventory_quantity, q + 1))}
                      className="px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="self-end pb-1">
                  {product.inventory_quantity > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      <Check size={14} /> In Stock ({product.inventory_quantity} units ready in {product.district})
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-200">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add to Cart, Buy Now, Wishlist */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.inventory_quantity <= 0}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition ${
                    addedSuccess
                      ? "bg-emerald-900 text-white"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white active:scale-98"
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.inventory_quantity <= 0}
                  className="flex-1 py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm text-center shadow-md transition active:scale-98"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border border-gray-300 flex items-center justify-center transition ${
                    isFavorited ? "text-red-600 bg-red-50 border-red-200" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
                    <Store size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/stores/${seller.slug}`}
                        className="font-bold text-sm text-gray-900 hover:text-emerald-800 transition"
                      >
                        {seller.business_name}
                      </Link>
                      <ShieldCheck size={14} className="text-emerald-700" />
                    </div>
                    <span className="text-[11px] text-gray-500">{seller.business_location}</span>
                  </div>
                </div>

                <Link
                  href={`/stores/${seller.slug}`}
                  className="px-3 py-1 border border-gray-300 hover:border-emerald-700 hover:text-emerald-800 text-xs font-semibold rounded-md transition"
                >
                  Visit Store
                </Link>
              </div>
              <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                {seller.business_description}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications & Detailed Tabs */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Full Description & Specifications */}
            <div className="md:col-span-7">
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">
                Authentic Ugandan Craftsmanship & Origin
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                {product.full_description}
              </p>

              {/* Technical Specifications Table */}
              <h4 className="font-bold text-sm text-gray-900 mb-3">
                Product Specifications
              </h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b border-gray-100 last:border-b-0`}
                  >
                    <span className="font-medium text-gray-600">{key}</span>
                    <span className="font-bold text-gray-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Estimator Column */}
            <div className="md:col-span-5">
              <DeliveryEstimator />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews
          productId={product.id}
          initialReviews={reviews}
          rating={product.rating}
          reviewCount={product.review_count}
        />

        {/* Related Ugandan Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">
              More Authentic Products in {product.category_name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
