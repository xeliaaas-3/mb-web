"use client";

import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** Botón flotante tipo pastilla para consultas por WhatsApp. */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname === "/bolsa" || pathname.startsWith("/prenda/")) return null;

  return (
    <a
      href={whatsappLink("¡Hola! Quisiera hacer una consulta.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-2.5 rounded-full bg-ink py-2.5 pr-4 pl-3 text-white shadow-float transition-[background-color,transform] hover:bg-bronze active:scale-95 lg:right-8 lg:bottom-8"
    >
      <WhatsAppIcon className="text-whatsapp-bright" />
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[9px] font-semibold tracking-[0.12em] uppercase">WhatsApp concierge</span>
        <span className="text-[11px] text-white/70">{site.whatsappDisplay}</span>
      </span>
    </a>
  );
}
