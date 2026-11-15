"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole, Seller } from "@/types/marketplace";
import { SELLERS } from "@/lib/data/store";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  currentSeller: Seller | null;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "miu_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>({
    id: "usr-demo-01",
    email: "israel.customer@miu.ug",
    full_name: "Israel Mukasa",
    phone: "+256 701 445566",
    role: "customer",
    created_at: "2024-01-01T00:00:00Z",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch {}
    }
  }, [user, mounted]);

  const switchRole = (newRole: UserRole) => {
    if (!user) {
      setUser({
        id: `usr-${newRole}-demo`,
        email: `${newRole}@miu.ug`,
        full_name: newRole === "admin" ? "Platform Administrator" : newRole === "seller" ? "Kato Francis (Mt. Elgon Coffee)" : "Israel Mukasa",
        phone: "+256 772 123456",
        role: newRole,
        created_at: new Date().toISOString(),
      });
      return;
    }
    setUser({
      ...user,
      role: newRole,
      full_name: newRole === "admin" ? "Platform Administrator" : newRole === "seller" ? "Kato Francis (Mt. Elgon Coffee)" : "Israel Mukasa",
    });
  };

  const login = (email: string, role: UserRole = "customer") => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split("@")[0].replace(".", " "),
      phone: "+256 772 000000",
      role,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  const role = user?.role || "customer";
  // If seller role, default to seller-1 (Mount Elgon Coffee Cooperative)
  const currentSeller = role === "seller" ? SELLERS[0] : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        currentSeller,
        switchRole,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
