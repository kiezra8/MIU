"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/types/marketplace";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selected_variant?: CartItem["selected_variant"]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totalPayable: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "miu_shopping_cart";
const COUPON_STORAGE_KEY = "miu_applied_coupon";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        setCouponCode(storedCoupon);
      }
    } catch {
      // Storage unavailable or parsing error
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch {
        // Storage unavailable
      }
    }
  }, [cart, mounted]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selected_variant?: CartItem["selected_variant"]
  ) => {
    setCart((prevCart) => {
      // Find matching item by product_id AND same variants
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product_id === product.id &&
          JSON.stringify(item.selected_variant || {}) === JSON.stringify(selected_variant || {})
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, product.inventory_quantity);
        updated[existingIndex].total_price_ugx = updated[existingIndex].quantity * updated[existingIndex].unit_price_ugx;
        return updated;
      }

      // Calculate unit price based on variant if any
      const unitPrice = product.price_ugx;

      const newItem: CartItem = {
        id: `cart-${product.id}-${Date.now()}`,
        product_id: product.id,
        product,
        selected_variant,
        quantity: Math.min(quantity, Math.max(1, product.inventory_quantity)),
        unit_price_ugx: unitPrice,
        total_price_ugx: unitPrice * quantity,
      };

      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.product.inventory_quantity;
          const cappedQty = Math.min(newQuantity, maxStock);
          return {
            ...item,
            quantity: cappedQty,
            total_price_ugx: cappedQty * item.unit_price_ugx,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
    setDiscount(0);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.total_price_ugx, 0);

  // Recalculate discount if coupon applied
  useEffect(() => {
    if (couponCode === "MIU2026") {
      setDiscount(Math.round(subtotal * 0.1)); // 10% off
    } else if (couponCode === "UGANDA50" && subtotal > 150000) {
      setDiscount(20000); // 20k off high order
    } else {
      setDiscount(0);
    }
  }, [subtotal, couponCode]);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "MIU2026") {
      setCouponCode("MIU2026");
      try { localStorage.setItem(COUPON_STORAGE_KEY, "MIU2026"); } catch {}
      return { success: true, message: "Coupon MIU2026 applied: 10% discount!" };
    }
    if (clean === "UGANDA50") {
      if (subtotal < 150000) {
        return { success: false, message: "UGANDA50 requires a minimum order of UGX 150,000" };
      }
      setCouponCode("UGANDA50");
      try { localStorage.setItem(COUPON_STORAGE_KEY, "UGANDA50"); } catch {}
      return { success: true, message: "Coupon UGANDA50 applied: UGX 20,000 discount!" };
    }
    return { success: false, message: "Invalid or expired coupon code" };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscount(0);
    try { localStorage.removeItem(COUPON_STORAGE_KEY); } catch {}
  };

  const totalPayable = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        totalPayable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
