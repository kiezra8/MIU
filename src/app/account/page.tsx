"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Clock, 
  ChevronRight, 
  Truck, 
  CheckCircle2,
  Plus,
  Trash2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { mockDb } from "@/lib/data/mockDb";
import { formatUGX, formatDate } from "@/lib/utils/formatters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function AccountPage() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const orders = mockDb.getOrders();

  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      label: "Home / Residential",
      name: user?.full_name || "Israel Mukasa",
      phone: "+256 701 445566",
      street: "Plot 12, Acacia Avenue, Kololo",
      district: "Kampala",
      is_default: true,
    },
    {
      id: "addr-2",
      label: "Office / Work",
      name: user?.full_name || "Israel Mukasa",
      phone: "+256 772 123456",
      street: "Lugogo Bypass Commercial Building, 3rd Floor",
      district: "Kampala",
      is_default: false,
    },
  ]);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newDistrict, setNewDistrict] = useState("Kampala");

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) return;
    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        label: "Alternative Address",
        name: user?.full_name || "Israel Mukasa",
        phone: user?.phone || "+256 701 445566",
        street: newStreet,
        district: newDistrict,
        is_default: false,
      },
    ]);
    setNewStreet("");
    setIsAddingAddress(false);
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Profile Card Header */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-emerald-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user?.full_name ? user.full_name[0] : "U"}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {user?.full_name || "Customer Account"}
              </h1>
              <p className="text-xs text-gray-500">{user?.email} • {user?.phone}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                MIU Verified Buyer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="px-4 py-2 border border-gray-300 hover:border-gray-500 rounded-xl text-xs font-bold text-gray-700 bg-white transition"
            >
              Edit Profile
            </Link>
            <Link
              href="/account/wishlist"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5"
            >
              <Heart size={14} />
              <span>Wishlist ({wishlist.length})</span>
            </Link>
          </div>
        </div>

        {/* 2-Column: Order History & Saved Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order History (8 cols) */}
          <div className="lg:col-span-8">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-emerald-700" />
              <span>My Orders & Delivery Tracking ({orders.length})</span>
            </h2>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:border-emerald-600 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-gray-900">
                            #{order.order_number}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                            {order.order_status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Placed on {formatDate(order.created_at)} • Tracking: {order.tracking_number}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-black text-emerald-800 block">
                          {formatUGX(order.total_payable_ugx)}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase">
                          {order.payment_method.replace("_", " ")} ({order.payment_status})
                        </span>
                      </div>
                    </div>

                    {/* Order Items Snapshot */}
                    <div className="py-3 divide-y divide-gray-50 space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs pt-2 first:pt-0">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 truncate max-w-xs">{item.product_name}</p>
                              <p className="text-[10px] text-gray-400">
                                Vendor: {item.seller_name} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-gray-900">{formatUGX(item.total_price_ugx)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer link to dedicated tracking */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Truck size={13} className="text-emerald-700" />
                        Destination: {order.district}, Uganda
                      </span>
                      <Link
                        href={`/orders/${order.order_number}`}
                        className="font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
                      >
                        <span>View Live Tracking & Details</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
                <p className="text-sm font-bold text-gray-900 mb-1">No orders placed yet</p>
                <p className="text-xs text-gray-500 mb-4">Explore our catalogue of authentic Ugandan goods</p>
                <Link
                  href="/"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          {/* Delivery Addresses (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-emerald-700" />
                <span>Delivery Addresses</span>
              </h2>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs text-emerald-800 font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Address
              </button>
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs space-y-2.5">
                <h4 className="font-bold text-gray-900">New Ugandan Address</h4>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">District</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                  >
                    <option value="Kampala">Kampala</option>
                    <option value="Wakiso">Wakiso</option>
                    <option value="Jinja">Jinja</option>
                    <option value="Mbarara">Mbarara</option>
                    <option value="Gulu">Gulu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plot 8, Buganda Road"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-700 text-white font-bold rounded"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards */}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs relative group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-xs text-gray-900">{addr.label}</span>
                    {addr.is_default && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{addr.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{addr.street}</p>
                  <p className="text-xs text-gray-500">{addr.district} District, Uganda</p>
                  <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>

                  {!addr.is_default && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="absolute top-3 right-3 text-gray-300 hover:text-red-600 transition"
                      aria-label="Delete Address"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
