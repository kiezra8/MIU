"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  SlidersHorizontal, 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Settings, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Percent,
  Truck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockDb } from "@/lib/data/mockDb";
import { formatUGX, formatDate } from "@/lib/utils/formatters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function AdminDashboardPage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "sellers" | "products" | "settings" | "audit">("overview");

  const [sellersList, setSellersList] = useState(mockDb.getSellers());
  const productsList = mockDb.getProducts();
  const ordersList = mockDb.getOrders();
  const settings = mockDb.getSettings();

  // Settings State
  const [commissionRate, setCommissionRate] = useState((settings.default_commission_rate * 100).toString());
  const [supportPhone, setSupportPhone] = useState(settings.support_phone);
  const [supportEmail, setSupportEmail] = useState(settings.support_email);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: "aud-1", action: "Approved Seller", target: "Rwenzori Pure Apiaries", time: "2 hours ago", admin: "Administrator" },
    { id: "aud-2", action: "Updated Commission", target: "Global rate set to 8%", time: "1 day ago", admin: "Administrator" },
    { id: "aud-3", action: "Verified Origin", target: "Mount Elgon AA Coffee (100% Locally Grown)", time: "2 days ago", admin: "Administrator" },
  ]);

  // Overall metrics
  const totalCustomers = 1420;
  const totalSellers = sellersList.length;
  const pendingSellers = sellersList.filter((s) => s.verification_status === "pending").length;
  const grossSales = ordersList.reduce((sum, o) => sum + o.subtotal_ugx, 0) + 7200000;
  const netMiuCommission = Math.round(grossSales * settings.default_commission_rate);

  const handleApproveSeller = (sellerId: string) => {
    const updated = mockDb.updateSellerStatus(sellerId, "verified_ugandan", true);
    if (updated) {
      setSellersList([...mockDb.getSellers()]);
      setAuditLogs([
        {
          id: `aud-${Date.now()}`,
          action: "Verified & Approved Seller",
          target: updated.business_name,
          time: "Just now",
          admin: "Administrator",
        },
        ...auditLogs,
      ]);
    }
  };

  const handleRejectSeller = (sellerId: string) => {
    const updated = mockDb.updateSellerStatus(sellerId, "rejected", false);
    if (updated) {
      setSellersList([...mockDb.getSellers()]);
      setAuditLogs([
        {
          id: `aud-${Date.now()}`,
          action: "Rejected Seller Application",
          target: updated.business_name,
          time: "Just now",
          admin: "Administrator",
        },
        ...auditLogs,
      ]);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const rateDecimal = parseFloat(commissionRate) / 100;
    mockDb.updateSettings({
      default_commission_rate: rateDecimal,
      support_phone: supportPhone,
      support_email: supportEmail,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
    setAuditLogs([
      {
        id: `aud-${Date.now()}`,
        action: "Updated Platform Configuration",
        target: `Commission rate updated to ${commissionRate}%`,
        time: "Just now",
        admin: "Administrator",
      },
      ...auditLogs,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Admin Bar Header */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-xl text-white">
              <SlidersHorizontal size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  MIU Administrator Command Center
                </h1>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Multi-vendor moderation, authentic origin verification, and nationwide Ugandan logistics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg text-emerald-400 font-mono">
              Audit Logging: Active
            </span>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Total Customers
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900">
              {totalCustomers.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Nationwide Uganda</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Ugandan Sellers
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900">
              {totalSellers}
            </div>
            <span className="text-[10px] text-yellow-600 font-semibold mt-1 block">
              {pendingSellers} Pending Review
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Catalog Products
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900">
              {productsList.length}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">10 Categories</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Gross Merchandise Value
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900">
              {formatUGX(grossSales)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 block">Orders Processed</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs col-span-2 md:col-span-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              MIU Net Commission
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-800">
              {formatUGX(netMiuCommission)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              @ {commissionRate}% platform fee
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-6 bg-white px-4 rounded-xl overflow-x-auto no-scrollbar shadow-2xs">
          {[
            { id: "overview", label: "Overview & Orders" },
            { id: "sellers", label: `Seller Moderation (${pendingSellers} pending)` },
            { id: "products", label: `Products Moderation (${productsList.length})` },
            { id: "settings", label: "Platform Rates & Commissions" },
            { id: "audit", label: "Security & Audit Logs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? "border-emerald-700 text-emerald-800"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Orders */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
              <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-emerald-700" />
                <span>Recent Marketplace Orders</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">District</th>
                      <th className="p-3">Total Payable</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ordersList.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/60 transition">
                        <td className="p-3 font-mono font-bold text-gray-900">
                          #{o.order_number}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{o.customer_name}</p>
                          <p className="text-[10px] text-gray-400">{o.customer_phone}</p>
                        </td>
                        <td className="p-3 font-medium">{o.district}</td>
                        <td className="p-3 font-bold text-emerald-800">
                          {formatUGX(o.total_payable_ugx)}
                        </td>
                        <td className="p-3 uppercase text-[10px] font-bold">
                          {o.payment_method.replace("_", " ")} ({o.payment_status})
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                            {o.order_status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            href={`/orders/${o.order_number}`}
                            className="font-bold text-emerald-800 hover:underline"
                          >
                            Inspect →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Seller Verification & Applications */}
        {activeTab === "sellers" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <Store size={18} className="text-emerald-700" />
              <span>Registered Ugandan Sellers & Verification Queue</span>
            </h2>

            <div className="space-y-4">
              {sellersList.map((seller) => (
                <div
                  key={seller.id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={seller.logo_url}
                        alt={seller.business_name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900">{seller.business_name}</h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            seller.verification_status === "verified_ugandan"
                              ? "bg-emerald-100 text-emerald-800"
                              : seller.verification_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {seller.verification_status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Owner: {seller.owner_name} • Phone: {seller.phone} • {seller.district} District
                      </p>
                      <p className="text-[11px] text-gray-600 mt-1 max-w-xl">
                        {seller.business_description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {seller.verification_status !== "verified_ugandan" ? (
                      <>
                        <button
                          onClick={() => handleApproveSeller(seller.id)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 size={14} />
                          <span>Verify Ugandan Maker</span>
                        </button>
                        <button
                          onClick={() => handleRejectSeller(seller.id)}
                          className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                        <ShieldCheck size={16} /> Verified Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Products Moderation */}
        {activeTab === "products" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <h2 className="text-base font-black text-gray-900 mb-4">
              All Marketplace Products ({productsList.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {productsList.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-xl p-3 flex gap-3 text-xs bg-gray-50/40">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={p.images[0]?.image_url || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80"}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 truncate">{p.name}</h4>
                    <p className="text-[11px] text-gray-500 font-bold">{formatUGX(p.price_ugx)}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 uppercase">
                      {p.verification_badge.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Platform Settings & Commercial Commissions */}
        {activeTab === "settings" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs max-w-2xl space-y-4 text-xs">
            <h2 className="text-base font-black text-gray-900 mb-1 flex items-center gap-2">
              <Percent size={18} className="text-emerald-700" />
              <span>Platform Commercial Rates & Contact Settings</span>
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Manage platform commission percentages and customer service parameters
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Default Platform Commission Rate (%) *
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="25"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:border-emerald-700"
                  />
                  <span className="absolute right-3 top-2.5 font-bold text-gray-400">%</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Deducted automatically from gross orders before vendor payout calculation.
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Customer Support Telephone Number *
                </label>
                <input
                  type="text"
                  required
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Official Support Email *
                </label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition"
                >
                  Save Platform Settings
                </button>
                {settingsSaved && (
                  <span className="text-emerald-700 font-bold">Settings saved and logged in audit log!</span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Tab 5: Security & Audit Logs */}
        {activeTab === "audit" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-emerald-700" />
              <span>Immutable Administrative Audit Trail</span>
            </h2>

            <div className="divide-y divide-gray-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">{log.action}</span>
                    <span className="text-gray-500">{log.target}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block">{log.time}</span>
                    <span className="font-mono text-[10px] text-emerald-800 font-bold">{log.admin}</span>
                  </div>
                </div>
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
