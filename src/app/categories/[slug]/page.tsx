import { CATEGORIES } from "@/lib/data/store";
import CategoryClient from "./CategoryClient";

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export default function CategoryProductsPage() {
  return <CategoryClient />;
}
