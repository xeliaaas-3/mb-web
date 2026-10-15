import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

const pages = [
  { path: "/catalogo", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/lookbook", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/gift-card", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/nosotras", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/guia-de-talles", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/envios-y-cambios", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/preguntas-frecuentes", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/contacto", priority: 0.5, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...pages.map((p) => ({ url: `${site.url}${p.path}`, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...products.map((p) => ({
      url: `${site.url}/prenda/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [p.images[0].src],
    })),
  ];
}
