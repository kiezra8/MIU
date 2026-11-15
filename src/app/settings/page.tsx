"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Settings, 
  User, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  FileText, 
  LogOut, 
  ChevronRight, 
  Check, 
  Store, 
  SlidersHorizontal 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function SettingsPage() {
  const { user, role, switchRole, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [fullName, setFullName] = useState(user?.full_name || "Israel Mukasa");
  const [phone, setPhone] = useState(user?.phone || "+256 701 445566");
  const [email, setEmail] = useState(user?.email || "israel.mukasa@miu.ug");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Account & Application Settings
              </h1>
              <p className="text-xs text-gray-500">
                Manage your profile, delivery addresses, security, and preferences
              </p>
            </div>
          </div>

          {/* Quick role display */}
          <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-lg text-gray-700 capitalize">
            Active Mode: {role}
          </span>
        </div>

        <div className="space-y-6">
          {/* Quick Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/account"
              className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <User size={18} className="text-emerald-700" />
                <span className="text-xs font-bold text-gray-900">Order History</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>

            <Link
              href="/seller/dashboard"
              className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <Store size={18} className="text-emerald-700" />
                <span className="text-xs font-bold text-gray-900">Seller Center</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>

            <Link
              href="/admin"
              className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={18} className="text-emerald-700" />
                <span className="text-xs font-bold text-gray-900">Admin Portal</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          </div>

          {/* Profile Management */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-emerald-700" />
              <span>Personal Profile</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Telephone (Uganda)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Check size={16} />
                  <span>Save Profile</span>
                </button>

                {savedSuccess && (
                  <span className="text-emerald-700 font-bold text-xs">
                    Profile updated successfully!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Role Switcher Sandbox for Demonstrator */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-2xs">
            <h2 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-700" />
              <span>Evaluation Role Simulator</span>
            </h2>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Experience MIU from all perspectives. Switch instantly between Customer, Verified Ugandan Seller, and Platform Administrator:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => switchRole("customer")}
                className={`p-3 rounded-xl border text-left transition ${
                  role === "customer"
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="font-bold text-xs block">Customer View</span>
                <span className={`text-[10px] ${role === "customer" ? "text-emerald-100" : "text-gray-400"}`}>
                  Shop, cart, checkout, track
                </span>
              </button>

              <button
                onClick={() => switchRole("seller")}
                className={`p-3 rounded-xl border text-left transition ${
                  role === "seller"
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="font-bold text-xs block">Seller View (Mt. Elgon)</span>
                <span className={`text-[10px] ${role === "seller" ? "text-emerald-100" : "text-gray-400"}`}>
                  Manage products, orders, payouts
                </span>
              </button>

              <button
                onClick={() => switchRole("admin")}
                className={`p-3 rounded-xl border text-left transition ${
                  role === "admin"
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="font-bold text-xs block">Admin View</span>
                <span className={`text-[10px] ${role === "admin" ? "text-emerald-100" : "text-gray-400"}`}>
                  Approvals, audits, commissions
                </span>
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <Bell size={18} className="text-emerald-700" />
              <span>Notification Preferences</span>
            </h2>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Email Order Notifications</span>
                  <span className="text-gray-500">Receive receipt, tracking updates and vendor dispatch emails</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-gray-100">
                <div>
                  <span className="font-bold text-gray-900 block">SMS Delivery Alerts</span>
                  <span className="text-gray-500">Receive rider updates directly to your MTN/Airtel phone</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsUpdates}
                  onChange={(e) => setSmsUpdates(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded"
                />
              </label>
            </div>
          </div>

          {/* Legal & Terms */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs">
            <h2 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-emerald-700" />
              <span>Policies & Information</span>
            </h2>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex justify-between items-center text-gray-700">
                <span>Made in Uganda Authenticity Verification Policy</span>
                <span className="font-bold text-emerald-800">UG Standard 2026</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-gray-700">
                <span>Privacy & Data Protection Policy</span>
                <span className="text-gray-400">Compliant with Uganda DPPA</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-gray-700">
                <span>Vendor Agreement & Commercial Terms</span>
                <span className="text-gray-400">v2.4</span>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <div className="pt-2">
            <button
              onClick={logout}
              className="w-full py-3.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-black transition flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              <span>Sign Out of MIU</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
