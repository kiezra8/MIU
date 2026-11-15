import { SELLERS } from "@/lib/data/store";
import StorefrontClient from "./StorefrontClient";

export function generateStaticParams() {
  return SELLERS.map((seller) => ({
    slug: seller.slug,
  }));
}

export default function SellerStorefrontPage() {
  return <StorefrontClient />;
}
