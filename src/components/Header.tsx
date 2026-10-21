"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { bagDrawer } from "@/lib/bagDrawer";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { site, whatsappLink } from "@/lib/site";
import { DemoBanner } from "./DemoBanner";
import { Logo } from "./Logo";
import { menuSections, navLinks } from "./nav";
import { WhatsAppIcon } from "./WhatsAppIcon";

function CountBadge({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span className="absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 font-sans text-[10px] leading-none text-white">
      {n}
    </span>
  );
}

export function Header() {
  const { count } = useCart();
  const favorites = useFavorites().length;
  const menuRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const closeMenu = () => menuRef.current?.close();

  useEffect(() => {
    menuRef.current?.close();
  }, [pathname]);

  return (
    <>
      <DemoBanner />
      <p className="overflow-hidden bg-ink py-2 text-center label-caps-sm whitespace-nowrap text-white">
        <span className="tracking-[0.1em] sm:tracking-[0.25em]">
          Envíos a todo el país<span className="hidden sm:inline"> · {site.installments} cuotas sin interés</span> ·
          Cambios en {site.exchangeDays} días
        </span>
      </p>
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-xl">
        <div className="page-width grid h-16 grid-cols-[1fr_auto_1fr] items-center page-x md:h-20">
          <div className="flex items-center gap-7">
            <button
              type="button"
              aria-label="Abrir menú"
              className="-ml-2 p-2 lg:hidden"
              onClick={() => menuRef.current?.showModal()}
            >
              <Menu size={22} strokeWidth={1.25} />
            </button>
            <nav aria-label="Principal" className="hidden gap-6 lg:flex">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`shrink-0 link-editorial label-caps whitespace-nowrap ${l.label === "Sale" ? "text-bronze" : ""}`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-0.5 md:gap-2">
            <Link href="/nosotras" className="mr-3 hidden link-editorial label-caps xl:inline">
              Nosotras
            </Link>
            <Link href="/contacto" className="mr-3 hidden link-editorial label-caps xl:inline">
              Contacto
            </Link>
            <Link href="/catalogo?buscar=" aria-label="Buscar prendas" className="p-2">
              <Search size={20} strokeWidth={1.25} />
            </Link>
            <Link
              href="/favoritos"
              aria-label={`Favoritos, ${favorites} ${favorites === 1 ? "prenda" : "prendas"}`}
              className="relative p-2"
            >
              <Heart size={20} strokeWidth={1.25} />
              <CountBadge n={favorites} />
            </Link>
            <button
              type="button"
              onClick={bagDrawer.open}
              aria-label={`Bolsa de compras, ${count} ${count === 1 ? "prenda" : "prendas"}`}
              className="relative -mr-2 p-2"
            >
              <ShoppingBag size={20} strokeWidth={1.25} />
              <CountBadge n={count} />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        aria-label="Menú"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-full max-w-sm bg-canvas p-0 text-ink shadow-drawer"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-hairline px-5">
            <span className="label-caps">Menú</span>
            <button type="button" aria-label="Cerrar menú" className="-mr-2 p-2" onClick={closeMenu}>
              <X size={20} strokeWidth={1.25} />
            </button>
          </div>
          <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto px-5 py-4">
            {menuSections.map((s, i) => (
              <details key={s.title} open={i === 0} className="group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-serif text-headline-sm italic [&::-webkit-details-marker]:hidden">
                  {s.title.toLowerCase()}
                  <ChevronDown size={18} strokeWidth={1.25} className="transition-transform group-open:rotate-180" />
                </summary>
                <ul className="pb-4">
                  {s.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={closeMenu}
                        className={`block py-2 text-body-lg ${l.label === "Sale" ? "text-bronze" : ""}`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
          <a
            href={whatsappLink("¡Hola! Quisiera hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-3 border-t border-hairline px-5 py-5"
          >
            <WhatsAppIcon className="text-whatsapp" />
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
