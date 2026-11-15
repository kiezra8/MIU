"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check, Star } from "lucide-react";
import { Product } from "@/types/marketplace";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatUGX } from "@/lib/utils/formatters";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const primaryImage =
    product.images[0]?.image_url ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className={`group relative bg-white overflow-hidden flex flex-col ${
        compact ? "" : "rounded-lg border border-gray-100 hover:shadow-md hover:border-gray-200"
      } transition-all duration-200`}
    >
      {/* ── Image Section (3:4 ratio, SHEIN-style dominant) ── */}
      <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Discount badge — top left red pill */}
        {product.discount_percentage && product.discount_percentage > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm shadow-sm tracking-tight">
            -{product.discount_percentage}%
          </span>
        )}

        {/* Wishlist — top right */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition shadow-sm ${
            isFavorited
              ? "bg-white text-red-500"
              : "bg-white/80 text-gray-400 hover:text-red-500 backdrop-blur-sm"
          }`}
          aria-label={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={14} fill={isFavorited ? "currentColor" : "none"} />
        </button>

        {/* Add to Cart — bottom bar slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              isAdded ? "bg-green-700 text-white" : "bg-black/90 hover:bg-black text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check size={13} /> Added!
              </>
            ) : (
              <>
                <ShoppingCart size={13} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Info Section ── */}
      <div className="pt-2 pb-3 px-1.5">
        {/* Product name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs sm:text-[13px] font-semibold text-gray-900 line-clamp-1 leading-snug mb-0.5 hover:text-green-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm sm:text-[15px] font-black text-gray-900">
            {formatUGX(product.price_ugx)}
          </span>
          {product.compare_at_price_ugx && product.compare_at_price_ugx > product.price_ugx && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatUGX(product.compare_at_price_ugx)}
            </span>
          )}
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1 mt-1">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-semibold text-gray-700">{product.rating}</span>
          <span className="text-[11px] text-gray-400">({product.review_count})</span>
        </div>
      </div>
    </div>
  );
};
