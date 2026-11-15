"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Store, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  MapPin, 
  FileText,
  X,
  Truck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockDb } from "@/lib/data/mockDb";
import { SELLERS, CATEGORIES, UGANDAN_DISTRICTS } from "@/lib/data/store";
import { formatUGX, formatDate } from "@/lib/utils/formatters";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Product, ProductVerificationBadge } from "@/types/marketplace";

export default function SellerDashboardPage() {
  const { currentSeller, user } = useAuth();
  // Default to seller-1 (Mount Elgon Coffee) if no seller session
  const activeSeller = currentSeller || SELLERS[0];

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "sales" | "settings">("overview");
  const [productsList, setProductsList] = useState<Product[]>(() =>
    mockDb.getProducts().filter((p) => p.seller_id === activeSeller.id)
  );
  const sellerOrders = mockDb.getOrdersBySeller(activeSeller.id);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("cat-4");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("25");
  const [newShortDesc, setNewShortDesc] = useState("");
  const [newFullDesc, setNewFullDesc] = useState("");
  const [newLocation, setNewLocation] = useState(activeSeller.business_location);
  const [newOriginBadge, setNewOriginBadge] = useState<ProductVerificationBadge>("locally_grown");
  const [newImageUrl, setNewImageUrl] = useState("https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80");

  // Calculate Metrics
  const totalProducts = productsList.length;
  const grossSales = sellerOrders.reduce((sum, o) => {
    const ful = o.seller_fulfillments.find((f) => f.seller_id === activeSeller.id);
    return sum + (ful?.subtotal_ugx || 0);
  }, 0);
  const totalCommission = Math.round(grossSales * activeSeller.commission_rate);
  const netPayout = grossSales - totalCommission;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const catObj = CATEGORIES.find((c) => c.id === newCategory);
    const priceNum = parseFloat(newPrice);

    const added = mockDb.addProduct({
      seller_id: activeSeller.id,
      seller: activeSeller,
      category_id: newCategory,
      subcategory_id: catObj?.subcategories[0]?.id || "sub-1",
      category_name: catObj?.name,
      subcategory_name: catObj?.subcategories[0]?.name,
      name: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      short_description: newShortDesc || "Authentic Ugandan product direct from manufacturer.",
      full_description: newFullDesc || "Handcrafted and grown with authentic care in Uganda.",
      price_ugx: priceNum,
      compare_at_price_ugx: Math.round(priceNum * 1.25),
      discount_percentage: 20,
      inventory_quantity: parseInt(newStock) || 20,
      sku: `UG-${Math.floor(1000 + Math.random() * 9000)}`,
      is_featured: false,
      is_trending: false,
      is_flash_sale: false,
      verification_badge: newOriginBadge,
      production_location: newLocation,
      district: activeSeller.district,
      status: "active",
      images: [
        {
          id: `img-${Date.now()}`,
          image_url: newImageUrl,
          alt_text: newTitle,
          is_primary: true,
        },
      ],
      specifications: {
        "Origin": activeSeller.district + ", Uganda",
        "Maker": activeSeller.business_name,
        "Authenticity": "Verified Made in Uganda",
      },
    });

    setProductsList([added, ...productsList]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewPrice("");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this product from the MIU marketplace?")) {
      mockDb.deleteProduct(id);
      setProductsList(productsList.filter((p) => p.id !== id));
    }
  };

  const handleUpdateFulfillment = (orderId: string, newStatus: "pending" | "processing" | "dispatched" | "delivered") => {
    mockDb.updateSellerFulfillmentStatus(orderId, activeSeller.id, newStatus, `Updated to ${newStatus} by vendor`);
    alert(`Order fulfillment updated to: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Seller Banner & Profile Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
              <Image
                src={activeSeller.logo_url}
                alt={activeSeller.business_name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                  {activeSeller.business_name}
                </h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Seller
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {activeSeller.business_location} • Commission Rate: {(activeSeller.commission_rate * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Link
              href={`/stores/${activeSeller.slug}`}
              className="flex-1 sm:flex-none px-3.5 py-2 border border-gray-300 hover:border-emerald-700 text-xs font-bold text-gray-700 hover:text-emerald-800 rounded-xl transition text-center"
            >
              View Public Storefront
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Gross Store Sales
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900">
              {formatUGX(grossSales)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              +14% vs last period
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Net Vendor Payout
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-800">
              {formatUGX(netPayout)}
            </div>
            <span className="text-[10px] text-gray-500 mt-1 block">
              Commission deducted: {formatUGX(totalCommission)}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Total Customer Orders
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900">
              {sellerOrders.length}
            </div>
            <span className="text-[10px] text-gray-500 mt-1 block">
              Multi-vendor order splits
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Active Inventory
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900">
              {totalProducts} Products
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              All Verified Ugandan
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-6 bg-white px-4 rounded-xl overflow-x-auto no-scrollbar shadow-2xs">
          {[
            { id: "overview", label: "Overview & Orders" },
            { id: "products", label: `Product Catalogue (${totalProducts})` },
            { id: "sales", label: "Financial Reports & Payouts" },
            { id: "settings", label: "Store Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
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
                <span>Orders Awaiting Fulfillment ({sellerOrders.length})</span>
              </h2>

              {sellerOrders.length > 0 ? (
                <div className="space-y-4">
                  {sellerOrders.map((order) => {
                    const ful = order.seller_fulfillments.find((f) => f.seller_id === activeSeller.id);
                    return (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-gray-900">
                              Order #{order.order_number}
                            </span>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full uppercase">
                              {ful?.fulfillment_status || "Pending"}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 mt-1">
                            Customer: <strong className="text-gray-900">{order.customer_name}</strong> • Phone: {order.customer_phone}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Deliver to: {order.delivery_address}, {order.district}
                          </p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                          <span className="text-sm font-black text-emerald-800">
                            Store Subtotal: {formatUGX(ful?.subtotal_ugx || 0)}
                          </span>

                          {/* Fulfillment Actions */}
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-gray-500 text-[11px]">Update Status:</span>
                            <select
                              value={ful?.fulfillment_status || "pending"}
                              onChange={(e) => handleUpdateFulfillment(order.id, e.target.value as any)}
                              className="p-1 border border-gray-300 rounded bg-white text-xs font-semibold focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing & Packaged</option>
                              <option value="dispatched">Dispatched to Courier</option>
                              <option value="delivered">Delivered to Buyer</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-6 text-center">No pending orders at this moment.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalogue */}
        {activeTab === "products" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-gray-900">
                Products in Your Storefront ({productsList.length})
              </h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Origin Badge</th>
                    <th className="p-3">Price (UGX)</th>
                    <th className="p-3">Inventory</th>
                    <th className="p-3">Sales</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition">
                      <td className="p-3 flex items-center gap-2.5">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={p.images[0]?.image_url || activeSeller.logo_url}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-gray-400">SKU: {p.sku}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium border border-emerald-200 text-[10px] uppercase">
                          {p.verification_badge.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-gray-900">
                        {formatUGX(p.price_ugx)}
                      </td>
                      <td className="p-3">
                        <span className={`font-semibold ${p.inventory_quantity < 10 ? "text-red-600" : "text-gray-900"}`}>
                          {p.inventory_quantity} units
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-800">
                        {p.sales_count} units
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${p.slug}`}
                            className="p-1 text-gray-500 hover:text-emerald-700"
                            title="View Public Page"
                          >
                            <Store size={15} />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Sales & Commission Breakdown */}
        {activeTab === "sales" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-6">
            <h2 className="text-base font-black text-gray-900 mb-1 flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-700" />
              <span>Commercial Statement & Commission Reconciliation</span>
            </h2>
            <p className="text-xs text-gray-500">
              Transparent breakdown of order sales and MIU marketplace commission
            </p>

            <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-gray-50 font-bold text-gray-900 flex justify-between border-b border-gray-200">
                <span>Account Metric</span>
                <span>Amount (UGX)</span>
              </div>
              <div className="p-3 flex justify-between border-b border-gray-100">
                <span className="text-gray-600">Gross Sales Value</span>
                <span className="font-bold text-gray-900">{formatUGX(grossSales)}</span>
              </div>
              <div className="p-3 flex justify-between border-b border-gray-100 text-red-600">
                <span>MIU Commission Fee ({(activeSeller.commission_rate * 100).toFixed(0)}%)</span>
                <span className="font-bold">-{formatUGX(totalCommission)}</span>
              </div>
              <div className="p-4 bg-emerald-50 flex justify-between font-black text-sm text-emerald-900">
                <span>Net Vendor Disbursable Balance</span>
                <span>{formatUGX(netPayout)}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-1">
              <p className="font-bold text-gray-900">Settlement Account Details:</p>
              <p>Mobile Money Account: MTN Mobile Money (+256 772 123456 - {activeSeller.owner_name})</p>
              <p>Payout Schedule: Weekly automatically every Monday morning</p>
            </div>
          </div>
        )}

        {/* Tab 4: Store Settings */}
        {activeTab === "settings" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs max-w-2xl space-y-4 text-xs">
            <h2 className="text-base font-black text-gray-900">Store Profile Configuration</h2>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Business Store Name</label>
              <input
                type="text"
                defaultValue={activeSeller.business_name}
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">WhatsApp Customer Service Number</label>
              <input
                type="text"
                defaultValue={activeSeller.whatsapp_number}
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Physical Workshop Address</label>
              <input
                type="text"
                defaultValue={activeSeller.business_location}
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Maker Story & Bio</label>
              <textarea
                rows={4}
                defaultValue={activeSeller.business_description}
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={() => alert("Store settings updated successfully!")}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl"
            >
              Update Store Profile
            </button>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <Plus size={18} className="text-emerald-700" />
                  <span>Add Authentic Ugandan Product</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Shea Butter Hair Nourisher (250g)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Product Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Price in UGX *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 35000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Initial Stock Units *</label>
                    <input
                      type="number"
                      required
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Ugandan Origin Badge *</label>
                    <select
                      value={newOriginBadge}
                      onChange={(e) => setNewOriginBadge(e.target.value as any)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none"
                    >
                      <option value="locally_grown">100% Locally Grown</option>
                      <option value="locally_manufactured">Locally Manufactured</option>
                      <option value="handcrafted">Handcrafted Artisan</option>
                      <option value="locally_processed">Locally Processed</option>
                      <option value="locally_assembled">Locally Assembled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Photo Image URL *</label>
                  <input
                    type="url"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Short Summary (1-2 sentences) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description for product cards"
                    value={newShortDesc}
                    onChange={(e) => setNewShortDesc(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Full craftsmanship details and origin information..."
                    value={newFullDesc}
                    onChange={(e) => setNewFullDesc(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                  >
                    Publish to MIU Marketplace
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
