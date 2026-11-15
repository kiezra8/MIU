import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Phone, MessageSquare, Award, ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data/store";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 pb-20 md:pb-8 text-gray-700">
      {/* 4 Pillars of MIU */}
      <div className="border-b border-gray-100 bg-gray-50 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">100% Ugandan Origin</h4>
              <p className="text-xs text-gray-500 mt-0.5">Verified local farmers, artisans & manufacturers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Nationwide Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">Delivering to Kampala, Jinja, Gulu, Mbarara & beyond.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <Award size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Buyer Protection</h4>
              <p className="text-xs text-gray-500 mt-0.5">Secure payment escrow & easy dispute resolution.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Ugandan Support</h4>
              <p className="text-xs text-gray-500 mt-0.5">WhatsApp & phone assistance in English & Luganda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-emerald-700 flex flex-col items-center justify-center text-white font-black text-xs">
              MIU
            </div>
            <span className="font-extrabold text-xl text-gray-900 tracking-tight">
              MIU<span className="text-emerald-700">.</span> Made In Uganda
            </span>
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mb-4">
            MIU is Uganda&apos;s premier multi-vendor e-commerce marketplace dedicated exclusively to authentic products made, grown, manufactured, designed, and handcrafted in the Pearl of Africa.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/256700123456?text=Hello%20MIU%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold transition"
            >
              <MessageSquare size={14} />
              Chat on WhatsApp
            </a>
            <Link
              href="/seller/register"
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 hover:border-gray-900 text-gray-900 rounded-md text-xs font-semibold transition"
            >
              Sell On MIU
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Top Categories</h4>
          <ul className="space-y-2 text-xs">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/categories/${c.slug}`} className="hover:text-emerald-700 transition">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/categories" className="text-emerald-700 font-semibold hover:underline">
                View All 10 Categories →
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/support" className="hover:text-emerald-700 transition">
                Help & Support Center
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-emerald-700 transition">
                Track My Order
              </Link>
            </li>
            <li>
              <Link href="/support#delivery" className="hover:text-emerald-700 transition">
                Delivery Rates by District
              </Link>
            </li>
            <li>
              <Link href="/support#returns" className="hover:text-emerald-700 transition">
                Returns & Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/support#faqs" className="hover:text-emerald-700 transition">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Multi-Vendor Sellers & Admin */}
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Sellers & Partners</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/seller/register" className="hover:text-emerald-700 transition font-medium">
                Apply to Sell on MIU
              </Link>
            </li>
            <li>
              <Link href="/seller/dashboard" className="hover:text-emerald-700 transition">
                Seller Center Dashboard
              </Link>
            </li>
            <li>
              <Link href="/support#verification" className="hover:text-emerald-700 transition">
                Made in Uganda Verification Process
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-gray-900 font-medium hover:underline">
                Administrator Portal
              </Link>
            </li>
          </ul>

          <div className="mt-5">
            <h5 className="font-bold text-[11px] text-gray-400 uppercase tracking-wider mb-2">Accepted Payments</h5>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded border border-yellow-200">MTN MoMo</span>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded border border-red-200">Airtel Money</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded border border-blue-200">Visa / Mastercard</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded border border-gray-200">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
        <p>© 2026 MIU — Made In Uganda Marketplace. All rights reserved.</p>
        <p className="flex items-center gap-1 font-medium text-emerald-800">
          Everything Ugandan, in one marketplace 🇺🇬
        </p>
      </div>
    </footer>
  );
};
