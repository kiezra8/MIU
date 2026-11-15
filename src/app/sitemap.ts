import { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES, SELLERS } from "@/lib/data/store";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://miu.ug";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/seller/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const storePages: MetadataRoute.Sitemap = SELLERS.map((s) => ({
    url: `${baseUrl}/stores/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...storePages];
}
