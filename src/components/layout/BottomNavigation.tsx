"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Headphones, Settings } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Exactly the five required destinations
  const navItems = [
    {
      name: "HOME",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "CATEGORIES",
      href: "/categories",
      icon: LayoutGrid,
      isActive: pathname.startsWith("/categories"),
    },
    {
      name: "CART",
      href: "/cart",
      icon: ShoppingCart,
      isActive: pathname === "/cart",
      badge: totalItems,
    },
    {
      name: "SUPPORT",
      href: "/support",
      icon: Headphones,
      isActive: pathname.startsWith("/support"),
    },
    {
      name: "SETTINGS",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings" || pathname.startsWith("/account"),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] pb-safe transition-all"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                active ? "text-emerald-700" : "text-gray-800 hover:text-gray-900"
              }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.3 : 1.8}
                  className={`transition-transform duration-150 ${active ? "scale-105" : ""}`}
                />
                {/* Live numerical cart badge */}
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-red-600 text-white text-[10px] font-extrabold rounded-full px-1 flex items-center justify-center shadow-xs animate-in zoom-in-75">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold tracking-tight uppercase leading-none ${
                  active ? "text-emerald-700 font-bold" : "text-gray-700"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
