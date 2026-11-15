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
        compact ? "" : "rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200"
      } transition-all duration-200 h-full`}
    >
      {/* ── Image Section (3:4 ratio dominant) ── */}
      <div className="relative w-full overflow-hidden bg-gray-50 aspect-3/4">
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
          <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm shadow-xs tracking-tight">
            -{product.discount_percentage}%
          </span>
        )}

        {/* Wishlist — top right */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition shadow-xs ${
            isFavorited
              ? "bg-white text-red-500"
              : "bg-white/85 text-gray-400 hover:text-red-500 backdrop-blur-xs"
          }`}
          aria-label={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={14} fill={isFavorited ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── Info Section ── */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Product name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 line-clamp-1 leading-snug mb-1 hover:text-green-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price row: Price specifically in GREEN */}
          <div className="flex items-baseline gap-1.5 flex-wrap mb-1">
            <span className="text-xs sm:text-sm md:text-base font-black text-green-700">
              {formatUGX(product.price_ugx)}
            </span>
            {product.compare_at_price_ugx && product.compare_at_price_ugx > product.price_ugx && (
              <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                {formatUGX(product.compare_at_price_ugx)}
              </span>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-semibold text-gray-700">{product.rating}</span>
            <span className="text-[11px] text-gray-400">({product.review_count})</span>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-1.5 sm:py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs ${
            isAdded
              ? "bg-green-800 text-white"
              : "bg-black hover:bg-green-700 text-white active:scale-95"
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
  );
};
