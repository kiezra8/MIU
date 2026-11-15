import { PRODUCTS } from "@/lib/data/store";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
