"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { button } from "@/components/ui";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useFavorites } from "@/lib/favorites";
import { formatGs } from "@/lib/format";
import { capitalize } from "@/lib/order";
import { findProduct } from "@/lib/products";
import { useProducts } from "@/components/CatalogProvider";
import { whatsappLink } from "@/lib/site";

export function FavoritesGrid() {
  const products = useProducts();
  const items = useFavorites().map((slug) => findProduct(products, slug)!);

  if (items.length === 0) {
    return (
      <div className="page-width page-x pb-section">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-sand px-6 py-16 text-center">
          <Heart size={28} strokeWidth={1.25} className="text-bronze" />
          <p className="max-w-sm text-body-lg text-stone-text">
            Todavía no guardaste prendas. Tocá el corazón en las que te gusten para encontrarlas acá.
          </p>
          <Link href="/catalogo" className={`${button.primary} mt-2`}>
            Ver colección
          </Link>
        </div>
      </div>
    );
  }

  const message = [
    "¡Hola! Me gustaron estas prendas, ¿tienen disponibilidad?",
    ...items.map((p) => `• ${capitalize(p.name)} — ${formatGs(p.price)}`),
  ].join("\n");

  return (
    <div className="page-width page-x pb-section">
      <div className="grid grid-cols-2 gap-x-gutter-mobile gap-y-10 md:gap-x-gutter lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={button.outline}>
          <WhatsAppIcon /> Consultar mis favoritos
        </a>
      </div>
    </div>
  );
}
