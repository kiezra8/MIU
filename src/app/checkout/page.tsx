"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ShieldCheck, 
  Truck, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Loader2,
  Lock
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { mockDb } from "@/lib/data/mockDb";
import { UGANDAN_DISTRICTS, INITIAL_PLATFORM_SETTINGS } from "@/lib/data/store";
import { formatUGX } from "@/lib/utils/formatters";
import { checkoutSchema, CheckoutFormData } from "@/lib/validations/checkout";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, totalPayable, clearCart } = useCart();
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"form" | "momo_prompt" | "verifying">("form");
  const [activePaymentMethod, setActivePaymentMethod] = useState<"mtn_momo" | "airtel_money" | "cash_on_delivery" | "card">("mtn_momo");
  const [selectedDistrict, setSelectedDistrict] = useState("Kampala");

  const deliveryFee = INITIAL_PLATFORM_SETTINGS.delivery_fees[selectedDistrict] || 15000;
  const grandTotal = Math.max(0, totalPayable + deliveryFee);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: user?.full_name || "",
      customer_phone: user?.phone || "+256 701 445566",
      customer_email: user?.email || "customer@miu.ug",
      delivery_address: "Plot 12, Acacia Avenue",
      district: "Kampala",
      city_town: "Kampala",
      delivery_instructions: "Please call when approaching the gate",
      payment_method: "mtn_momo",
      momo_phone_number: "+256 772 123456",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (cart.length === 0) return;

    setIsProcessing(true);

    if (data.payment_method === "mtn_momo" || data.payment_method === "airtel_money") {
      setPaymentStep("momo_prompt");

      // Verify with payment provider response (realistic 2.5s prompt confirmation cycle)
      setTimeout(() => {
        setPaymentStep("verifying");
        setTimeout(() => {
          completeOrder(data);
        }, 1500);
      }, 2500);
    } else {
      // Cash on delivery or card
      setTimeout(() => {
        completeOrder(data);
      }, 1000);
    }
  };

  const completeOrder = (data: CheckoutFormData) => {
    const createdOrder = mockDb.createOrder({
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email,
      delivery_address: data.delivery_address,
      district: data.district,
      city_town: data.city_town,
      delivery_instructions: data.delivery_instructions,
      payment_method: data.payment_method,
      cartItems: cart,
      discount_ugx: discount,
    });

    clearCart();
    setIsProcessing(false);
    router.push(`/orders/${createdOrder.order_number}`);
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-base font-bold text-gray-900 mb-2">Your cart is empty</p>
          <p className="text-xs text-gray-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
          <Link href="/" className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold">
            Return to Marketplace
          </Link>
        </div>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Checkout Header */}
        <div className="mb-6 pb-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Checkout & Nationwide Delivery
            </h1>
            <p className="text-xs text-gray-500">
              Complete your order for authentic Ugandan products
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock size={13} />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Modal / State for Mobile Money USSD Prompt Verification */}
        {paymentStep !== "form" ? (
          <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg my-12">
            {paymentStep === "momo_prompt" ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-800 mx-auto flex items-center justify-center animate-bounce">
                  <Smartphone size={32} />
                </div>
                <h3 className="font-black text-lg text-gray-900">
                  Authorizing {activePaymentMethod === "mtn_momo" ? "MTN Mobile Money" : "Airtel Money"}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  A payment authorization prompt of{" "}
                  <strong className="text-gray-900 font-black">{formatUGX(grandTotal)}</strong> has been pushed to your mobile device.
                </p>
                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 font-mono border border-gray-200">
                  Please enter your Mobile Money PIN on your handset to approve this MIU transaction.
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 font-bold pt-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Awaiting telecom gateway confirmation...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-black text-lg text-gray-900">
                  Payment Verified by Telecom Gateway!
                </h3>
                <p className="text-xs text-gray-600">
                  Generating order records, assigning tracking number, and dispatching notifications to local Ugandan vendors...
                </p>
                <Loader2 size={20} className="animate-spin text-emerald-700 mx-auto" />
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Delivery Details & Payment Selection (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer & Delivery Information Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="font-black text-base text-gray-900 mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-emerald-700" />
                  <span>1. Delivery Destination (Uganda)</span>
                </h3>

                <div className="space-y-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      {...register("customer_name")}
                      placeholder="e.g. Christine Namugga"
                      className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                    {errors.customer_name && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.customer_name.message}</p>
                    )}
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Telephone Number (for MoMo & Delivery) *
                      </label>
                      <input
                        type="tel"
                        {...register("customer_phone")}
                        placeholder="+256 772 123456"
                        className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                      />
                      {errors.customer_phone && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.customer_phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Email Address (for Receipt & Tracking) *
                      </label>
                      <input
                        type="email"
                        {...register("customer_email")}
                        placeholder="you@domain.ug"
                        className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                      />
                      {errors.customer_email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.customer_email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* District & City/Town */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Ugandan District *
                      </label>
                      <select
                        {...register("district")}
                        value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setValue("district", e.target.value);
                        }}
                        className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-emerald-700 font-medium"
                      >
                        {UGANDAN_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist} District (Delivery: {formatUGX(INITIAL_PLATFORM_SETTINGS.delivery_fees[dist] || 15000)})
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.district.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        City / Town / Division *
                      </label>
                      <input
                        type="text"
                        {...register("city_town")}
                        placeholder="e.g. Nakawa / Ntinda / Jinja Central"
                        className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                      />
                      {errors.city_town && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.city_town.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Detailed Street Address */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Physical Street Address / Landmark *
                    </label>
                    <input
                      type="text"
                      {...register("delivery_address")}
                      placeholder="e.g. Plot 14, Kira Road, Opposite Total Petrol Station"
                      className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                    {errors.delivery_address && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.delivery_address.message}</p>
                    )}
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Delivery Instructions for Rider (Optional)
                    </label>
                    <input
                      type="text"
                      {...register("delivery_instructions")}
                      placeholder="e.g. Call upon arrival, leave with security at reception"
                      className="w-full p-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="font-black text-base text-gray-900 mb-4 flex items-center gap-2">
                  <Smartphone size={18} className="text-emerald-700" />
                  <span>2. Payment Method</span>
                </h3>

                <div className="space-y-3">
                  {/* MTN Mobile Money */}
                  <label
                    className={`flex items-start justify-between p-3.5 rounded-xl border-2 cursor-pointer transition ${
                      activePaymentMethod === "mtn_momo"
                        ? "border-emerald-700 bg-emerald-50/40"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        value="mtn_momo"
                        checked={activePaymentMethod === "mtn_momo"}
                        onChange={() => {
                          setActivePaymentMethod("mtn_momo");
                          setValue("payment_method", "mtn_momo");
                        }}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-gray-900">
                            MTN Mobile Money
                          </span>
                          <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[10px] font-black rounded">
                            MTN
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Instant USSD PIN prompt sent to your MTN phone across Uganda.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Airtel Money */}
                  <label
                    className={`flex items-start justify-between p-3.5 rounded-xl border-2 cursor-pointer transition ${
                      activePaymentMethod === "airtel_money"
                        ? "border-emerald-700 bg-emerald-50/40"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        value="airtel_money"
                        checked={activePaymentMethod === "airtel_money"}
                        onChange={() => {
                          setActivePaymentMethod("airtel_money");
                          setValue("payment_method", "airtel_money");
                        }}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-gray-900">
                            Airtel Money
                          </span>
                          <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded">
                            AIRTEL
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Instant authorization push to your Airtel line.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start justify-between p-3.5 rounded-xl border-2 cursor-pointer transition ${
                      activePaymentMethod === "cash_on_delivery"
                        ? "border-emerald-700 bg-emerald-50/40"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        value="cash_on_delivery"
                        checked={activePaymentMethod === "cash_on_delivery"}
                        onChange={() => {
                          setActivePaymentMethod("cash_on_delivery");
                          setValue("payment_method", "cash_on_delivery");
                        }}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-gray-900">
                            Cash on Delivery
                          </span>
                          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-800 text-[10px] font-bold rounded">
                            COD
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Pay directly to our certified delivery courier upon inspecting your package.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Bank Card (Visa / Mastercard) */}
                  <label
                    className={`flex items-start justify-between p-3.5 rounded-xl border-2 cursor-pointer transition ${
                      activePaymentMethod === "card"
                        ? "border-emerald-700 bg-emerald-50/40"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        value="card"
                        checked={activePaymentMethod === "card"}
                        onChange={() => {
                          setActivePaymentMethod("card");
                          setValue("payment_method", "card");
                        }}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-gray-900">
                            Debit / Credit Card
                          </span>
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                            Visa / Mastercard
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Secured via local bank 3D-Secure payment processor.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs sticky top-24">
                <h3 className="font-black text-base text-gray-900 pb-3 border-b border-gray-200 mb-4">
                  Review Your Order ({cart.length} items)
                </h3>

                {/* Items Preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                        <Image
                          src={item.product.images[0]?.image_url || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatUGX(item.total_price_ugx)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-2 text-xs text-gray-600 py-3 border-t border-b border-gray-100">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-gray-900">{formatUGX(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Discount:</span>
                      <span>-{formatUGX(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery to {selectedDistrict}:</span>
                    <span className="font-bold text-gray-900">{formatUGX(deliveryFee)}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="flex items-baseline justify-between pt-3 pb-5">
                  <span className="font-black text-base text-gray-900">Grand Total:</span>
                  <span className="text-2xl font-black text-emerald-800">
                    {formatUGX(grandTotal)}
                  </span>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <span>Confirm Order & Pay {formatUGX(grandTotal)}</span>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                  By confirming, you verify that you are purchasing genuine Ugandan products. Protected by the MIU Authenticity Guarantee.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
