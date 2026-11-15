import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#008751",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "MIU — Made In Uganda | Everything Ugandan, In One Marketplace",
  description:
    "Official digital marketplace dedicated exclusively to authentic Ugandan products. Shop coffee, kitenge fashion, handcrafted crafts, organic produce, footwear, and locally manufactured goods nationwide.",
  keywords: [
    "Made In Uganda",
    "MIU",
    "Uganda marketplace",
    "Buy Ugandan",
    "Ugandan coffee",
    "Kitenge",
    "Ugandan fashion",
    "Kampala crafts",
    "Rwenzori honey",
    "Ugandan electronics",
  ],
  authors: [{ name: "MIU Made in Uganda Ltd" }],
  openGraph: {
    title: "MIU — Made In Uganda Marketplace",
    description: "Everything Ugandan, in one marketplace. Authentic products directly from local farmers, artisans, and manufacturers.",
    url: "https://miu.ug",
    siteName: "MIU Marketplace",
    locale: "en_UG",
    type: "website",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-white text-gray-900 font-sans">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
