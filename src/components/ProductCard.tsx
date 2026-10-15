"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { bagDrawer } from "@/lib/bagDrawer";
import { cart } from "@/lib/cart";
import { formatGs } from "@/lib/format";
import { badgeLabel, inStock, type Product } from "@/lib/products";
import { card } from "./ui";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const available = product.sizes.filter((s) => s.stock > 0);
  const [size, setSize] = useState(available[0]?.label ?? "");
  const href = `/prenda/${product.slug}`;
  const [front, back] = product.images;

  function add() {
    cart.add({ slug: product.slug, size, color: product.colors[0].name });
    trackEvent("add_to_cart", { product: product.slug, size, value: product.price });
    bagDrawer.open();
  }

  return (
    <article className={`group flex flex-col p-2.5 sm:p-3 ${card}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-sand">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <Image
            src={front.src}
            alt={front.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
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
            className={`absolute top-2 left-2 rounded-sm px-2 py-0.5 label-caps-sm ${
              product.badge === "oferta" ? "bg-bronze text-white" : "bg-ink text-white"
            }`}
          >
            {badgeLabel[product.badge]}
          </span>
        )}
      </div>

      <h3 className="mt-3 truncate font-serif text-[15px] leading-snug italic md:text-title">
        <Link href={href} className="hover:underline hover:underline-offset-4">
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-body-sm font-semibold md:text-price">
        {formatGs(product.price)}
        {product.compareAt && (
          <s className="text-body-sm font-normal text-stone-text">
            <span className="sr-only">Antes </span>
            {formatGs(product.compareAt)}
          </s>
        )}
      </p>

      {inStock(product) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1" role="group" aria-label="Talle">
          <span className="mr-1 text-[10px] text-stone-text">Talles:</span>
          {product.sizes.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={s.stock === 0}
              aria-pressed={size === s.label}
              onClick={() => setSize(s.label)}
              className={`min-w-6 rounded-sm border px-1.5 py-0.5 text-[10px] transition-colors ${
                size === s.label ? "border-ink bg-ink text-white" : "border-hairline text-ink hover:border-ink"
              } disabled:text-stone disabled:line-through disabled:hover:border-hairline`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        disabled={!size}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink py-2.5 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-bronze disabled:bg-sand-deep disabled:text-stone-text"
      >
        {size ? (
          <>
            <ShoppingBag size={12} strokeWidth={1.75} /> Añadir a bolsa
          </>
        ) : (
          "Agotado"
        )}
      </button>
    </article>
  );
}
