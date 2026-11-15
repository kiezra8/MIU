"use client";

import React, { useState } from "react";
import { Truck, MapPin, Clock, ShieldCheck } from "lucide-react";
import { UGANDAN_DISTRICTS, INITIAL_PLATFORM_SETTINGS } from "@/lib/data/store";
import { formatUGX } from "@/lib/utils/formatters";

export const DeliveryEstimator: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Kampala");

  const fee = INITIAL_PLATFORM_SETTINGS.delivery_fees[selectedDistrict] || 15000;

  const getEstimatedDays = (dist: string) => {
    if (dist === "Kampala" || dist === "Wakiso") return "1 – 2 Business Days (Same-day dispatch available)";
    if (dist === "Mukono" || dist === "Entebbe" || dist === "Jinja") return "2 – 3 Business Days";
    return "3 – 5 Business Days via regional courier hubs";
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-6">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={18} className="text-emerald-700" />
        <h4 className="font-bold text-xs sm:text-sm text-gray-900">
          Nationwide Uganda Delivery Calculator
        </h4>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
        <label className="text-xs text-gray-600 font-medium whitespace-nowrap">
          Deliver to:
        </label>
        <div className="relative flex-1">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full text-xs font-semibold p-2 pr-7 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-700"
          >
            {UGANDAN_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between py-1 border-t border-gray-200">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock size={13} className="text-gray-400" /> Estimated Time:
          </span>
          <span className="font-bold text-gray-900">{getEstimatedDays(selectedDistrict)}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-gray-200">
          <span className="text-gray-500 flex items-center gap-1">
            <Truck size={13} className="text-gray-400" /> Standard Delivery Fee:
          </span>
          <span className="font-black text-emerald-800">{formatUGX(fee)}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-1">
          <ShieldCheck size={13} className="text-emerald-700 shrink-0" />
          <span>Orders inspected for authentic Ugandan origin before dispatch.</span>
        </div>
      </div>
    </div>
  );
};
