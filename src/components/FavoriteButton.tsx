"use client";

import { Heart } from "lucide-react";
import { favorites, useFavorites } from "@/lib/favorites";

export function FavoriteButton({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const saved = useFavorites().includes(slug);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
      onClick={() => favorites.toggle(slug)}
      className={`flex size-9 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      <Heart size={16} strokeWidth={1.5} className={saved ? "fill-bronze text-bronze" : "text-ink"} />
    </button>
  );
}
