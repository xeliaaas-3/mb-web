"use client";

import Image from "next/image";
import { isOptimizable } from "@/lib/images";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { bagDrawer, useBagDrawerOpen } from "@/lib/bagDrawer";
import { cart, useCart } from "@/lib/cart";
import { formatGs } from "@/lib/format";
import { imageFor } from "@/lib/products";
import { freeDeliveryThreshold } from "@/lib/site";
import { button } from "./ui";

/** Bolsa lateral: se abre al agregar una prenda o desde el ícono del header. */
export function BagDrawer() {
  const open = useBagDrawerOpen();
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const { items, count, subtotal } = useCart();
  const missingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    bagDrawer.close();
  }, [pathname]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="bolsa-lateral"
      onClose={bagDrawer.close}
      onClick={(e) => e.target === e.currentTarget && bagDrawer.close()}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md bg-canvas p-0 text-ink shadow-drawer open:animate-[drawer-in_400ms_var(--ease-editorial)]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2 id="bolsa-lateral" className="flex items-center gap-2 font-serif text-headline-sm italic">
            <ShoppingBag size={20} strokeWidth={1.25} />
            tu bolsa
            <span className="font-sans text-body-sm text-stone-text not-italic">({count})</span>
          </h2>
          <button
            type="button"
            aria-label="Cerrar bolsa"
            onClick={bagDrawer.close}
            className="-mr-2 rounded-full p-2 hover:bg-sand"
          >
            <X size={20} strokeWidth={1.25} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="text-body-md text-stone-text">
              Tu bolsa está vacía. Explorá el catálogo para agregar prendas.
            </p>
            <Link href="/catalogo" className={button.primary}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {items.map((item) => {
                const image = imageFor(item.product, item.color);
                return (
                  <li key={item.key} className="flex gap-4 rounded-2xl border border-hairline bg-card p-3 shadow-soft">
                    <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                      <Image
                        src={image.src}
                        unoptimized={!isOptimizable(image.src)}
                        alt={image.alt}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-serif text-body-lg italic">{item.product.name}</p>
                        <button
                          type="button"
                          onClick={() => cart.remove(item.key)}
                          className="shrink-0 text-body-sm text-stone-text underline-offset-2 hover:text-error hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                      <p className="text-body-sm text-stone-text">
                        Talle {item.size} · {item.color}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-hairline">
                          <button
                            type="button"
                            aria-label="Restar una unidad"
                            disabled={item.qty <= 1}
                            onClick={() => cart.setQty(item.key, item.qty - 1, item.maxQty)}
                            className="flex size-7 items-center justify-center disabled:text-stone"
                          >
                            <Minus size={12} strokeWidth={1.5} />
                          </button>
                          <span className="w-5 text-center text-body-sm">{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Sumar una unidad"
                            disabled={item.qty >= item.maxQty}
                            onClick={() => cart.setQty(item.key, item.qty + 1, item.maxQty)}
                            className="flex size-7 items-center justify-center disabled:text-stone"
                          >
                            <Plus size={12} strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="text-price">{formatGs(item.lineTotal)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-4 border-t border-hairline px-6 py-5">
              <p className="text-body-sm text-stone-text">
                {missingForFree > 0
                  ? `Te faltan ${formatGs(missingForFree)} para el envío gratis a Gran Asunción.`
                  : "¡Tenés envío gratis a Gran Asunción!"}
              </p>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-title italic">subtotal</span>
                <span className="text-headline-sm font-medium">{formatGs(subtotal)}</span>
              </div>
              <Link href="/bolsa" className={`${button.primary} w-full`}>
                Finalizar pedido
              </Link>
              <button type="button" onClick={bagDrawer.close} className={`${button.outline} w-full`}>
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
