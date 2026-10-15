"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { badgeLabel, type Product } from "@/lib/products";

/** Mobile: carrusel con scroll-snap. Desktop: imágenes apiladas (columna de 7). */
export function Gallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const { images } = product;

  function onScroll() {
    const el = trackRef.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function goTo(i: number) {
    const el = trackRef.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible"
      >
        {images.map((image, i) => (
          <div
            key={image.src}
            className={`relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-sand lg:rounded-2xl ${i === 0 ? "lg:col-span-2" : ""}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 29vw, 100vw"}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
        {product.badge && (
          <span className="rounded-sm bg-ink px-2 py-1 label-caps-sm text-white">{badgeLabel[product.badge]}</span>
        )}
        <span className="rounded-sm bg-white/90 px-2 py-1 label-caps-sm">{product.material}</span>
      </div>

      <FavoriteButton slug={product.slug} name={product.name} className="absolute top-3 right-3 size-11" />

      {images.length > 1 && (
        <div className="absolute bottom-3 left-3 flex gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 lg:hidden">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Ver imagen ${i + 1} de ${images.length}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`size-1.5 rounded-full ${i === index ? "bg-ink" : "bg-stone"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
