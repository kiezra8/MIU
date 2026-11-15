import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, MapPin } from "lucide-react";
import { Seller } from "@/types/marketplace";

interface FeaturedBrandsProps {
  sellers: Seller[];
}

export const FeaturedBrands: React.FC<FeaturedBrandsProps> = ({ sellers }) => {
  const featured = sellers.filter((s) => s.is_active).slice(0, 4);

  return (
    <section className="my-10 bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
            <Award size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              Featured Ugandan Brands
            </h2>
            <p className="text-xs text-gray-500">Recognized leaders in Ugandan manufacturing and sustainable production</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {featured.map((seller) => (
          <Link
            key={seller.id}
            href={`/stores/${seller.slug}`}
            className="group bg-white border border-gray-200 hover:border-emerald-600 rounded-xl p-4 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <Image
                    src={seller.logo_url}
                    alt={seller.business_name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-800 transition truncate">
                    {seller.business_name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                    <MapPin size={11} className="text-emerald-700 shrink-0" />
                    <span className="truncate">{seller.district}, Uganda</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                {seller.business_description}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck size={12} />
                Verified Brand
              </span>
              <span className="font-bold text-gray-900">{seller.product_count} Products</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
