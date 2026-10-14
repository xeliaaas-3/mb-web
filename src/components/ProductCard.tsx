"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import { cart } from "@/lib/cart";
import { formatGs } from "@/lib/format";
import { badgeLabel, inStock, type Product } from "@/lib/products";
import { showToast } from "@/lib/toast";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [picking, setPicking] = useState(false);
  const available = inStock(product);
  const href = `/prenda/${product.slug}`;
  const [front, back] = product.images;

  function add(size: string) {
    cart.add({ slug: product.slug, size, color: product.colors[0].name });
    setPicking(false);
    showToast({ message: `Agregaste ${product.name} (talle ${size}).`, href: "/bolsa", action: "Ver bolsa" });
  }

  function onQuickAdd() {
    const sizes = product.sizes.filter((s) => s.stock > 0);
    if (sizes.length === 1) add(sizes[0].label);
    else setPicking(true);
  }

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <Image
            src={front.src}
            alt={front.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-opacity duration-700 ease-editorial"
          />
          {back && (
            <Image
              src={back.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-700 ease-editorial group-hover:opacity-100"
            />
          )}
        </Link>
        {product.badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-1 label-caps-sm ${
              product.badge === "oferta" ? "bg-bronze text-white" : "bg-ink text-white"
            }`}
          >
            {badgeLabel[product.badge]}
          </span>
        )}

        {picking && (
          <div className="absolute inset-x-0 bottom-0 animate-[fade-in_300ms] bg-white/95 p-3 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="label-caps-sm">Elegí tu talle</span>
              <button type="button" aria-label="Cancelar" onClick={() => setPicking(false)} className="-m-1 p-1">
                <X size={14} strokeWidth={1.25} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  disabled={s.stock === 0}
                  onClick={() => add(s.label)}
                  className="h-9 min-w-9 border border-hairline px-2 label-caps-sm transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:text-stone disabled:line-through disabled:hover:border-hairline disabled:hover:bg-transparent"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className="mt-3 flex items-center gap-1.5"
        aria-label={`Colores: ${product.colors.map((c) => c.name).join(", ")}`}
      >
        {product.colors.map((c) => (
          <span key={c.name} className="size-2.5 rounded-full border border-hairline" style={{ background: c.hex }} />
        ))}
      </div>
      <h3 className="mt-2 font-serif text-title lowercase italic">
        <Link href={href} className="link-editorial">
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-price">
        {formatGs(product.price)}
        {product.compareAt && (
          <s className="text-body-sm text-stone-text">
            <span className="sr-only">Antes </span>
            {formatGs(product.compareAt)}
          </s>
        )}
      </p>
      <button
        type="button"
        onClick={onQuickAdd}
        disabled={!available}
        className="mt-3 h-10 bg-ink label-caps text-white transition-colors duration-300 hover:bg-bronze disabled:bg-sand-deep disabled:text-stone-text"
      >
        {available ? "Añadir" : "Agotado"}
      </button>
    </article>
  );
}
