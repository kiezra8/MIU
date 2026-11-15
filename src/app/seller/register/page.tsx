"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Store, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  FileText, 
  Building2 
} from "lucide-react";
import { mockDb } from "@/lib/data/mockDb";
import { sellerRegistrationSchema, SellerRegistrationFormData } from "@/lib/validations/seller";
import { UGANDAN_DISTRICTS } from "@/lib/data/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function SellerRegistrationPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SellerRegistrationFormData>({
    resolver: zodResolver(sellerRegistrationSchema),
    defaultValues: {
      origin_type: "locally_manufactured",
      district: "Kampala",
      accept_terms: false,
    },
  });

  const onSubmit = (data: SellerRegistrationFormData) => {
    mockDb.registerSeller({
      business_name: data.business_name,
      owner_name: data.owner_name,
      email: data.email,
      phone: data.phone,
      business_location: data.business_location,
      district: data.district,
      business_description: data.business_description,
      registration_number: data.registration_number,
      origin_type: data.origin_type,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Banner */}
        <div className="bg-emerald-800 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-emerald-200 text-xs font-semibold mb-3">
            <Store size={14} />
            <span>MIU Vendor Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Sell Your Authentic Ugandan Products
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Join hundreds of Ugandan farmers, manufacturers, designers, and artisans reaching thousands of customers nationwide. Low 8% commission only on completed orders.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Our vendor authenticity verification team will review your business details and origin declaration within 24 to 48 hours. You will receive an SMS and email notification upon approval.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/seller/dashboard"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Explore Seller Portal
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 border border-gray-300 hover:border-gray-500 rounded-xl text-xs font-bold text-gray-700 bg-white transition"
              >
                Back to Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div>
              <h2 className="text-base font-black text-gray-900 mb-1 flex items-center gap-2">
                <Building2 size={18} className="text-emerald-700" />
                <span>1. Business & Maker Information</span>
              </h2>
              <p className="text-xs text-gray-500">Provide official details about your Ugandan enterprise</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  {...register("business_name")}
                  placeholder="e.g. Karamoja Woven Guild"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
                {errors.business_name && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.business_name.message}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Founder / Owner Name *
                </label>
                <input
                  type="text"
                  {...register("owner_name")}
                  placeholder="e.g. Sarah Nalubega"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
                {errors.owner_name && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.owner_name.message}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Business Telephone (Uganda) *
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="+256 772 123456"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Business Email Address *
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="contact@business.ug"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Operating District *
                </label>
                <select
                  {...register("district")}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-emerald-700 font-medium"
                >
                  {UGANDAN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Physical Workshop / Farm Address *
                </label>
                <input
                  type="text"
                  {...register("business_location")}
                  placeholder="e.g. Plot 4, Jinja Industrial Area"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
                {errors.business_location && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.business_location.message}</p>
                )}
              </div>
            </div>

            {/* Ugandan Origin Classification */}
            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-base font-black text-gray-900 mb-1 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-700" />
                <span>2. Authentic Ugandan Origin Classification</span>
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                How are your products produced or added value within Uganda?
              </p>

              <div className="space-y-2 text-xs">
                {[
                  { id: "locally_manufactured", label: "Locally Manufactured", desc: "Goods transformed, sewn, welded or processed in a Ugandan factory/workshop" },
                  { id: "locally_grown", label: "Locally Grown (Agriculture)", desc: "Coffee, honey, tea, fruits, grains harvested directly from Ugandan soil" },
                  { id: "handcrafted", label: "Handcrafted / Artisan", desc: "Baskets, sculptures, jewelry, pottery created by local Ugandan artisans" },
                  { id: "locally_processed", label: "Locally Processed", desc: "Raw agricultural materials refined or packaged into consumer foods/skincare" },
                  { id: "locally_assembled", label: "Locally Assembled Technology", desc: "Electronics, solar systems, or equipment assembled by Ugandan engineers" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                  >
                    <input
                      type="radio"
                      value={item.id}
                      {...register("origin_type")}
                      className="mt-1 text-emerald-700 focus:ring-emerald-700"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">{item.label}</span>
                      <span className="text-gray-500 text-[11px]">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description & Documentation */}
            <div className="pt-4 border-t border-gray-100 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Business Description & Product Range *
                </label>
                <textarea
                  rows={4}
                  {...register("business_description")}
                  placeholder="Describe your business history, where materials are sourced, and what you produce in Uganda..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
                {errors.business_description && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.business_description.message}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  URSB Registration / TIN Number (Optional for smallholders)
                </label>
                <input
                  type="text"
                  {...register("registration_number")}
                  placeholder="e.g. URSB-800201991"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>

              {/* Terms & Authenticity Pledge */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("accept_terms")}
                    className="mt-0.5 w-4 h-4 text-emerald-700 rounded focus:ring-emerald-700"
                  />
                  <span className="text-gray-700 leading-relaxed">
                    I solemnly pledge that all products listed on MIU by my enterprise are authentic, genuine, and produced or added value within Uganda. I accept the 8% order commission and MIU Vendor Agreement.
                  </span>
                </label>
                {errors.accept_terms && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.accept_terms.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Submit Seller Application</span>
              <ArrowRight size={17} />
            </button>
          </form>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
