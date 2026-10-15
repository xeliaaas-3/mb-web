import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { card } from "@/components/ui";
import { policies } from "@/lib/content";
import { formatGs } from "@/lib/format";
import { freeDeliveryThreshold, shippingOptions } from "@/lib/site";

export const metadata: Metadata = {
  title: "Envíos, cambios y políticas",
  description: "Costos y tiempos de envío, cambios, devoluciones y privacidad.",
  alternates: { canonical: "/envios-y-cambios" },
};

export default function PoliciesPage() {
  return (
    <>
      <PageHeader eyebrowText="Ayuda" title="envíos, cambios y políticas">
        Todo lo que necesitás saber antes y después de tu compra.
      </PageHeader>

      <section className="page-width page-x pb-10" aria-label="Costos de envío">
        <ul className="grid gap-gutter-mobile md:grid-cols-3 md:gap-gutter">
          {shippingOptions.map((o) => (
            <li key={o.id} className={`p-6 ${card}`}>
              <p className="label-caps-sm text-stone-text">{o.label}</p>
              <p className="mt-2 font-serif text-headline-md">{o.cost === 0 ? "Gratis" : formatGs(o.cost)}</p>
              <p className="mt-2 text-body-sm text-stone-text">{o.detail}</p>
              {o.id === "delivery" && (
                <p className="mt-3 text-body-sm font-medium text-bronze">
                  Gratis en compras desde {formatGs(freeDeliveryThreshold)}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="page-width page-x pb-section">
        <div className="max-w-3xl space-y-10">
          {policies.map((p) => (
            <section key={p.title} id={p.title.toLowerCase()} className="scroll-mt-28">
              <h2 className="font-serif text-headline-sm italic">{p.title.toLowerCase()}</h2>
              <div className="mt-3 space-y-3 text-body-lg text-stone-text">
                {p.paragraphs.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
