"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { bagDrawer } from "@/lib/bagDrawer";
import { useCart } from "@/lib/cart";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";
import { navLinks } from "./nav";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Header() {
  const { count } = useCart();
  const menuRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    menuRef.current?.close();
  }, [pathname]);

  return (
    <>
      <p className="overflow-hidden bg-ink py-2 text-center label-caps-sm whitespace-nowrap text-white">
        <span className="tracking-[0.1em] sm:tracking-[0.25em]">
          Envíos a todo el país<span className="hidden sm:inline"> · Asunción y Gran Asunción</span> · Coordiná por
          WhatsApp
        </span>
      </p>
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-xl">
        <div className="page-width grid h-16 grid-cols-[1fr_auto_1fr] items-center page-x md:h-20">
          <div className="flex items-center gap-8">
            <button
              type="button"
              aria-label="Abrir menú"
              className="-ml-2 p-2 lg:hidden"
              onClick={() => menuRef.current?.showModal()}
            >
              <Menu size={22} strokeWidth={1.25} />
            </button>
            <nav aria-label="Principal" className="hidden gap-7 lg:flex">
              {navLinks.slice(0, 4).map((l) => (
                <Link key={l.href} href={l.href} className="shrink-0 link-editorial label-caps whitespace-nowrap">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-1 md:gap-3">
            <Link href="/#boutique" className="mr-4 hidden link-editorial label-caps lg:inline">
              Boutique
            </Link>
            <Link href="/catalogo?buscar=" aria-label="Buscar prendas" className="p-2">
              <Search size={20} strokeWidth={1.25} />
            </Link>
            <button
              type="button"
              onClick={bagDrawer.open}
              aria-label={`Bolsa de compras, ${count} ${count === 1 ? "prenda" : "prendas"}`}
              className="relative -mr-2 p-2"
            >
              <ShoppingBag size={20} strokeWidth={1.25} />
              {count > 0 && (
                <span className="absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 font-sans text-[10px] leading-none text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        aria-label="Menú"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-full max-w-xs border-r border-hairline bg-canvas p-0 text-ink shadow-drawer"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
            <span className="label-caps">Menú</span>
            <button
              type="button"
              aria-label="Cerrar menú"
              className="-mr-2 p-2"
              onClick={() => menuRef.current?.close()}
            >
              <X size={20} strokeWidth={1.25} />
            </button>
          </div>
          <nav aria-label="Menú móvil" className="flex flex-col px-5 py-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b border-hairline py-4 font-serif text-headline-sm lowercase"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <a
            href={whatsappLink("¡Hola! Quisiera hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center gap-3 border-t border-hairline px-5 py-5"
          >
            <WhatsAppIcon />
            <span>
              <span className="block label-caps">WhatsApp concierge</span>
              <span className="text-body-sm text-stone-text">{site.whatsappDisplay}</span>
            </span>
          </a>
        </div>
      </dialog>
    </>
  );
}
