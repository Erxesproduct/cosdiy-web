import type { MetadataRoute } from "next";
import { catalogUpdatedAt, categories, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(catalogUpdatedAt);
  return [
    { url: absoluteUrl("/"), lastModified, priority: 1 },
    { url: absoluteUrl("/shop"), lastModified, priority: 0.9 },
    ...categories.map((c) => ({ url: absoluteUrl(`/shop?c=${c.id}`), lastModified, priority: 0.8 })),
    ...products.map((p) => ({ url: absoluteUrl(`/p/${p.slug}`), lastModified, priority: p.stock === 0 ? 0.4 : 0.7 })),
    { url: absoluteUrl("/info"), lastModified, priority: 0.5 },
  ];
}
