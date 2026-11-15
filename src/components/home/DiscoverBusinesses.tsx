import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, Star, MapPin, ArrowRight } from "lucide-react";
import { Seller } from "@/types/marketplace";

interface DiscoverBusinessesProps {
  sellers: Seller[];
}

export const DiscoverBusinesses: React.FC<DiscoverBusinessesProps> = ({ sellers }) => {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
            <Store size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              Discover Ugandan Businesses
            </h2>
            <p className="text-xs text-gray-500">Shop directly from verified local storefronts across the country</p>
          </div>
        </div>

        <Link
          href="/seller/register"
          className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-0.5"
        >
          <span>Join as a Seller</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sellers.slice(0, 3).map((seller) => (
          <div
            key={seller.id}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
          >
            {/* Storefront Banner */}
            <div className="relative h-28 w-full bg-gray-100 overflow-hidden">
              <Image
                src={seller.banner_url}
                alt={seller.business_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Storefront Body */}
            <div className="p-4 relative flex-1 flex flex-col justify-between">
              {/* Overlapping Logo */}
              <div className="flex items-start justify-between -mt-9 mb-2">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border-2 border-white shadow-md">
                  <Image
                    src={seller.logo_url}
                    alt={seller.business_name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-gray-100 text-xs font-bold text-gray-800">
                  <Star size={13} className="fill-yellow-400 text-yellow-400" />
                  <span>{seller.rating}</span>
                  <span className="text-gray-400 font-normal">({seller.rating_count})</span>
                </div>
              </div>

              <div>
                <Link href={`/stores/${seller.slug}`}>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition line-clamp-1">
                    {seller.business_name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 mb-2">
                  <MapPin size={12} className="text-emerald-700" />
                  <span>{seller.business_location}</span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {seller.business_description}
                </p>
              </div>

              <Link
                href={`/stores/${seller.slug}`}
                className="w-full py-2 px-3 border border-emerald-700 hover:bg-emerald-700 hover:text-white text-emerald-800 font-bold rounded-lg text-xs text-center transition flex items-center justify-center gap-1.5"
              >
                <span>Visit Storefront</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
