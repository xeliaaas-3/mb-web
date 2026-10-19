import { site } from "@/lib/site";

/** Aviso de que la tienda es una demo. Se quita borrando `site.demo`. */
export function DemoBanner() {
  if (!site.demo) return null;
  return (
    <a
      href={`https://www.instagram.com/${site.demo.instagram}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-bronze py-1.5 text-center text-[11px] font-medium tracking-[0.08em] text-white hover:bg-ink"
    >
      Demo de {site.demo.by} · tienda de ejemplo <span className="opacity-80">· @{site.demo.instagram}</span>
    </a>
  );
}
