import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // MIU Strictly Enforced Palette:
        // 1. White — main background
        // 2. Black — typography & important interface elements
        // 3. Green — primary brand color & active navigation
        // 4. Red — discounts, promotional labels & special offers
        // 5. Blue — secondary actions & information
        miu: {
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#008751", // Official Ugandan Green brand color
            800: "#046a38",
            900: "#064e2b",
            DEFAULT: "#008751",
          },
          red: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            500: "#ef4444",
            600: "#dc2626", // Discount & promo badges
            700: "#b91c1c",
            DEFAULT: "#dc2626",
          },
          blue: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            500: "#3b82f6",
            600: "#2563eb", // Secondary actions & info
            700: "#1d4ed8",
            DEFAULT: "#2563eb",
          },
          black: "#111827",
          white: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
