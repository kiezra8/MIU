"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/marketplace";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeImage = images[selectedIdx] || images[0] || {
    image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    alt_text: productName,
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails (horizontal on mobile, vertical column on desktop) */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0">
        {images.map((img, idx) => (
          <button
            key={img.id || idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition ${
              selectedIdx === idx
                ? "border-emerald-700 shadow-sm"
                : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
            }`}
          >
            <Image
              src={img.image_url}
              alt={img.alt_text || productName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Large Image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 shadow-xs">
        <Image
          src={activeImage.image_url}
          alt={activeImage.alt_text || productName}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
};
