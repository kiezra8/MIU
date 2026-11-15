"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Store, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Printer, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { mockDb } from "@/lib/data/mockDb";
import { formatUGX, formatDate } from "@/lib/utils/formatters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderIdOrNum = params?.id as string;

  const order = mockDb.getOrderById(orderIdOrNum) || mockDb.getOrders()[0];

  const steps = [
    { title: "Order Placed", desc: "Received & verified by MIU", done: true },
    { title: "Vendor Confirmed", desc: "Locally packaged by artisan/farmer", done: true },
    { title: "Dispatched", desc: "Handed to courier partner", done: order.order_status !== "placed" },
    { title: "In Transit", desc: "En route across Uganda", done: order.order_status === "in_transit" || order.order_status === "delivered" },
    { title: "Delivered", desc: "Received by customer", done: order.order_status === "delivered" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Success Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                Order Confirmed
              </span>
              <h1 className="text-2xl font-black text-gray-900">
                Order #{order.order_number}
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Thank you for supporting authentic Ugandan enterprise! Confirmation sent to {order.customer_email}.
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-gray-300 hover:border-gray-500 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs transition shrink-0"
          >
            <Printer size={15} />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Tracking Progress Timeline */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Delivery Status & Tracking</h3>
              <p className="text-xs text-gray-500">Tracking Code: <strong className="font-mono text-gray-900">{order.tracking_number}</strong></p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Est. Delivery</span>
              <span className="text-xs font-black text-emerald-800">
                {formatDate(order.estimated_delivery_date)}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {steps.map((st, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black mb-2 transition shadow-2xs ${
                    st.done
                      ? "bg-emerald-700 text-white ring-4 ring-emerald-100"
                      : "bg-gray-100 text-gray-400 border border-gray-300"
                  }`}
                >
                  {idx + 1}
                </div>
                <h5 className="font-bold text-xs text-gray-900 leading-snug">{st.title}</h5>
                <p className="text-[10px] text-gray-500 mt-0.5">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Vendor Fulfillment Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-2xs">
          <h3 className="font-black text-base text-gray-900 mb-4 flex items-center gap-2">
            <Store size={18} className="text-emerald-700" />
            <span>Seller Fulfillment Breakdown</span>
          </h3>

          <div className="space-y-6">
            {order.seller_fulfillments.map((ful) => (
              <div key={ful.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs sm:text-sm text-gray-900">
                      {ful.seller_name}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      Status: {ful.fulfillment_status}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    Subtotal: {formatUGX(ful.subtotal_ugx)}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  <span className="font-semibold text-gray-800">Dispatch Notes:</span> {ful.tracking_notes || "Processing at seller workshop"}
                </p>

                {/* Items in this fulfillment */}
                <div className="space-y-2">
                  {order.items
                    .filter((item) => item.seller_id === ful.seller_id)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{item.product_name}</p>
                            <p className="text-[11px] text-gray-400">Qty: {item.quantity} x {formatUGX(item.unit_price_ugx)}</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">{formatUGX(item.total_price_ugx)}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Destination Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
              Delivery Details
            </h4>
            <p className="font-bold text-gray-900">{order.customer_name}</p>
            <p className="text-gray-600">{order.customer_phone}</p>
            <p className="text-gray-600 mt-1">{order.delivery_address}</p>
            <p className="text-gray-600">{order.city_town}, {order.district} District, Uganda</p>
            {order.delivery_instructions && (
              <p className="text-gray-500 italic mt-2">Instructions: &quot;{order.delivery_instructions}&quot;</p>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
              Payment Summary
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-bold uppercase">{order.payment_method.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-emerald-800 uppercase">{order.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold">{formatUGX(order.subtotal_ugx)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="font-bold">{formatUGX(order.delivery_fee_ugx)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-sm text-gray-900">
                <span>Total Paid:</span>
                <span className="text-emerald-800">{formatUGX(order.total_payable_ugx)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
          >
            <span>Continue Shopping on MIU</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
