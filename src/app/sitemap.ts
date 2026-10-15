import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    ...products.map((p) => ({
      url: `${site.url}/prenda/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [p.images[0].src],
    })),
  ];
}
