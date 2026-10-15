"use client";

import Link from "next/link";
import { useState } from "react";
import { RefreshCw, Ruler, ShoppingBag, Store, Truck } from "lucide-react";
import { SizeAssistant } from "@/components/SizeAssistant";
import { button } from "@/components/ui";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { cart } from "@/lib/cart";
import { formatGs } from "@/lib/format";
import { capitalize } from "@/lib/order";
import { categoryOf, totalStock, type Product } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { bagDrawer } from "@/lib/bagDrawer";

export function PurchasePanel({ product }: { product: Product }) {
  const available = product.sizes.filter((s) => s.stock > 0);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(available.length === 1 ? available[0].label : null);
  const [sizeError, setSizeError] = useState(false);
  const stock = totalStock(product);
  const isApparel = categoryOf(product).group === "ropa";

  function requireSize() {
    if (size) return true;
    setSizeError(true);
    return false;
  }

  function addToBag() {
    if (!requireSize()) return;
    cart.add({ slug: product.slug, size: size!, color });
    trackEvent("add_to_cart", { product: product.slug, size: size!, value: product.price });
    bagDrawer.open();
  }

  const directMessage = `¡Hola! Quiero pedir ${capitalize(product.name)}${size ? `, talle ${size}` : ""}, color ${color} (${formatGs(product.price)}). ¿Está disponible?`;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="label-caps-sm">Alba Atelier</p>
        {stock > 0 ? (
          <p className="flex shrink-0 items-center gap-1.5 label-caps-sm whitespace-nowrap text-success">
            <span className="size-1.5 rounded-full bg-success" /> Stock Asunción
          </p>
        ) : (
          <p className="label-caps-sm text-error">Agotado</p>
        )}
      </div>
      <h1 className="mt-3 font-serif text-headline-lg-mobile lowercase md:text-headline-lg">{product.name}</h1>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-sans text-headline-sm font-medium">{formatGs(product.price)}</span>
        {product.compareAt && <s className="text-body-md text-stone-text">{formatGs(product.compareAt)}</s>}
        <span className="text-body-sm text-stone-text">
          o {site.installments} cuotas sin interés de {formatGs(Math.ceil(product.price / site.installments))}
        </span>
      </p>

      {stock > 0 && stock <= 5 && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-hairline bg-sand px-4 py-3 text-body-sm">
          <Store size={16} strokeWidth={1.25} className="shrink-0" />
          <span>
            En stock:{" "}
            <strong className="font-medium">{stock === 1 ? "1 unidad lista" : `${stock} unidades listas`}</strong> en{" "}
            {site.address.city}.
          </span>
        </p>
      )}

      <fieldset className="mt-6">
        <div className="flex justify-between">
          <legend className="label-caps-sm">
            Tono: <span className="tracking-normal text-stone-text normal-case">{color}</span>
          </legend>
          <span className="label-caps-sm text-stone-text">
            {product.colors.length} {product.colors.length === 1 ? "tono" : "tonos"}
          </span>
        </div>
        <div className="mt-3 flex gap-3">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              aria-pressed={color === c.name}
              onClick={() => setColor(c.name)}
              className={`flex size-10 items-center justify-center rounded-full border transition-colors ${
                color === c.name ? "border-ink" : "border-transparent hover:border-stone"
              }`}
            >
              <span className="size-7 rounded-full border border-hairline" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6" aria-describedby={sizeError ? "size-error" : undefined}>
        <div className="flex items-center justify-between">
          <legend className="label-caps-sm">
            Talle: <span className="tracking-normal text-stone-text normal-case">{size ?? "elegí uno"}</span>
          </legend>
          {isApparel && (
            <SizeAssistant className="inline-flex shrink-0 items-center gap-1.5 link-editorial label-caps-sm whitespace-nowrap">
              <Ruler size={14} strokeWidth={1.25} /> ¿Cuál es mi talle?
            </SizeAssistant>
          )}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {product.sizes.map((s) => {
            const selected = size === s.label;
            return (
              <button
                key={s.label}
                type="button"
                disabled={s.stock === 0}
                aria-pressed={selected}
                aria-label={s.stock === 0 ? `${s.label}, agotado` : s.label}
                onClick={() => {
                  setSize(s.label);
                  setSizeError(false);
                }}
                className={`h-12 rounded-lg border bg-card label-caps transition-colors ${
                  selected ? "border-ink bg-ink text-white" : "border-hairline hover:border-ink"
                } disabled:cursor-not-allowed disabled:bg-sand disabled:text-stone disabled:line-through disabled:hover:border-hairline`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        {sizeError && (
          <p id="size-error" role="alert" className="mt-2 text-body-sm text-error">
            Elegí un talle para continuar.
          </p>
        )}
        {isApparel && (
          <p className="mt-3 text-body-sm text-stone-text">La modelo mide 1,74 m y lleva puesto el talle S.</p>
        )}
      </fieldset>

      <div className="mt-6 flex flex-col gap-3">
        <button type="button" onClick={addToBag} disabled={stock === 0} className={button.primary}>
          <ShoppingBag size={16} strokeWidth={1.25} />
          Agregar a la bolsa<span className="hidden sm:inline"> · {formatGs(product.price)}</span>
        </button>
        <a
          href={whatsappLink(directMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!requireSize()) e.preventDefault();
          }}
          className={button.whatsappOutline}
        >
          <WhatsAppIcon className="text-whatsapp" />
          Pedir directo por WhatsApp
        </a>
      </div>

      <ul className="mt-5 flex flex-wrap justify-between gap-3 text-body-sm text-stone-text">
        <li className="flex items-center gap-2">
          <Truck size={16} strokeWidth={1.25} /> Envío a todo Paraguay
        </li>
        <li className="flex items-center gap-2">
          <RefreshCw size={14} strokeWidth={1.25} /> Cambio simple en {site.exchangeDays} días
        </li>
      </ul>

      <p className="mt-4 text-body-sm">
        <Link href="/bolsa" className="link-editorial">
          Ir a mi bolsa
        </Link>
      </p>
    </div>
  );
}
