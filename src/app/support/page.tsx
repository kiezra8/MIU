"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Headphones, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  ShieldCheck,
  Send
} from "lucide-react";
import { mockDb } from "@/lib/data/mockDb";
import { supportTicketSchema, SupportTicketFormData } from "@/lib/validations/support";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function SupportPage() {
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      category: "general",
    },
  });

  const onSubmit = (data: SupportTicketFormData) => {
    const created = mockDb.createTicket({ ...data, priority: "medium" });
    setSubmittedTicket(created.ticket_number);
    reset();
  };

  const faqs = [
    {
      q: "How do I pay with MTN Mobile Money or Airtel Money on MIU?",
      a: "When checking out, select MTN Mobile Money or Airtel Money and confirm your phone number. You will receive an instant USSD authorization prompt on your handset requesting your 4-digit mobile money PIN. Once approved, your order status immediately shifts to confirmed.",
    },
    {
      q: "How does nationwide delivery work across Ugandan districts?",
      a: "Orders in Kampala and Wakiso are delivered within 24 to 48 hours. For all other districts (such as Jinja, Gulu, Mbarara, Mbale, and Arua), delivery takes 2 to 4 business days via our certified logistics network and regional parcel hubs. You can track your parcel anytime using your order tracking number.",
    },
    {
      q: "What makes products on MIU authentically 'Made in Uganda'?",
      a: "Every product listed on MIU undergoes verification to ensure genuine Ugandan origin: locally grown crops and coffee, manufactured goods with Ugandan value addition, handcrafted artisan creations, or locally assembled technology. Verified items display official Made in Uganda badges.",
    },
    {
      q: "What is the returns and refund policy?",
      a: "If an item arrives damaged, defective, or noticeably different from the product description, you can report it within 7 days of delivery through our Customer Support Centre. We arrange for return pickup and issue a full refund or replacement through your original payment method.",
    },
    {
      q: "How do Ugandan businesses register to sell on MIU?",
      a: "Click 'Sell on MIU' or navigate to /seller/register. Fill out your business details, origin type, and contact number. Our vendor verification team reviews your application within 24 to 48 hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Support Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3">
            <Headphones size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            MIU Customer Support Centre
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            We are here to assist with orders, payments, delivery across Uganda, and vendor inquiries.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* In-App WhatsApp Chat Direct Link */}
          <Link
            href="/chat"
            className="group bg-[#075E54] text-white rounded-2xl p-5 hover:bg-[#008069] transition shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <MessageSquare size={20} />
              </div>
              <h3 className="font-bold text-base mb-1">In-App Live Chat</h3>
              <p className="text-xs text-emerald-100">
                Direct instant support & order placement with voice note & texting option.
              </p>
            </div>
            <span className="text-xs font-black underline mt-4">Open WhatsApp Chat System →</span>
          </Link>

          {/* Telephone Line */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center mb-3">
                <Phone size={20} />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-1">Telephone Support</h3>
              <p className="text-xs text-gray-500">
                Monday to Saturday, 8:00 AM – 7:00 PM EAT.
              </p>
            </div>
            <p className="text-sm font-black text-gray-900 mt-4">+256 700 123 456</p>
          </div>

          {/* Office / Email */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center mb-3">
                <Mail size={20} />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-1">Email & Location</h3>
              <p className="text-xs text-gray-500">
                support@miu.ug • Plot 18, Nakasero Road, Kampala, Uganda.
              </p>
            </div>
            <p className="text-xs font-semibold text-emerald-800 mt-4">Average response: &lt; 2 hrs</p>
          </div>
        </div>

        {/* 2-Column: Support Ticket Form & FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Support Ticket Submission (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="font-black text-base text-gray-900 mb-1">
              Submit a Support Ticket
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Enter details below and our customer team will follow up by telephone or email.
            </p>

            {submittedTicket ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white mx-auto flex items-center justify-center">
                  <Check size={24} />
                </div>
                <h4 className="font-black text-base text-gray-900">Ticket #{submittedTicket} Created</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your ticket has been logged in our customer resolution system. A Ugandan support agent will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      {...register("customer_name")}
                      placeholder="e.g. Wasswa Emmanuel"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                    {errors.customer_name && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.customer_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Telephone (Uganda) *</label>
                    <input
                      type="tel"
                      {...register("customer_phone")}
                      placeholder="+256 772 123456"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                    {errors.customer_phone && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.customer_phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      {...register("customer_email")}
                      placeholder="you@domain.ug"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                    {errors.customer_email && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.customer_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Category *</label>
                    <select
                      {...register("category")}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-emerald-700"
                    >
                      <option value="order">Order Assistance</option>
                      <option value="payment">MTN/Airtel Payment Help</option>
                      <option value="delivery">Delivery Status / Courier</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="seller">Seller Inquiries</option>
                      <option value="general">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Order Number (if applicable)</label>
                  <input
                    type="text"
                    {...register("order_number")}
                    placeholder="e.g. MIU-2026-8841"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    {...register("subject")}
                    placeholder="e.g. Delivery status inquiry for Mbale order"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-red-600 mt-0.5">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Detailed Message *</label>
                  <textarea
                    rows={4}
                    {...register("message")}
                    placeholder="Please provide complete details so we can resolve your issue swiftly..."
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-600 mt-0.5">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send size={15} />
                  <span>Submit Ticket</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQs Accordion (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-black text-base text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle size={18} className="text-emerald-700" />
              <span>Frequently Asked Questions</span>
            </h3>

            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-gray-900 hover:bg-gray-50 flex items-center justify-between gap-2 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${isOpen ? "rotate-180 text-emerald-700" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
