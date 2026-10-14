"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Grid2x2, Leaf, Shirt, Sparkles, Store } from "lucide-react";
import { navLinks } from "./nav";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

const icons = [Sparkles, Grid2x2, Shirt, Leaf, Store];

function isActive(href: string, pathname: string, query: string) {
  const [path, q = ""] = href.split("?");
  if (path.startsWith("/#")) return false;
  return pathname === path && q === query;
}

/** Barra inferior (solo mobile) + botón flotante de WhatsApp. */
export function BottomNav() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const hideFloating = pathname === "/bolsa" || pathname.startsWith("/prenda/");

  return (
    <>
      {!hideFloating && (
        <a
          href={whatsappLink("¡Hola! Quisiera hacer una consulta.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Consultar por WhatsApp"
          className="fixed right-4 bottom-20 z-30 flex size-12 items-center justify-center gap-3 bg-ink text-white shadow-[0_0_0_1px_rgb(255_255_255/0.08)] transition-colors hover:bg-whatsapp sm:size-auto sm:py-3 sm:pr-5 sm:pl-4 lg:right-8 lg:bottom-8"
        >
          <WhatsAppIcon />
          <span className="hidden sm:block">
            <span className="block label-caps-sm">WhatsApp concierge</span>
            <span className="text-body-sm">{site.whatsappDisplay}</span>
          </span>
        </a>
      )}
      <nav
        aria-label="Accesos rápidos"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-hairline bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
      >
        {navLinks.map((l, i) => {
          const Icon = icons[i];
          const active = isActive(l.href, pathname, query);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 ${active ? "text-ink" : "text-stone-text"}`}
            >
              <Icon size={20} strokeWidth={1.25} />
              <span className="font-label text-[9px] leading-3 font-semibold tracking-[0.06em] uppercase">
                {l.short}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
