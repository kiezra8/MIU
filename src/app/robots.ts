import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/seller/dashboard/", "/api/"],
    },
    sitemap: "https://miu.ug/sitemap.xml",
  };
}
