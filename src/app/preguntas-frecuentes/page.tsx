import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { button } from "@/components/ui";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { faq } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Pedidos, pagos, envíos, cambios y talles: todo lo que necesitás saber para comprar.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.flatMap((s) =>
      s.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader eyebrowText="Ayuda" title="preguntas frecuentes">
        Si no encontrás tu respuesta, escribinos por WhatsApp y te respondemos al toque.
      </PageHeader>

      <div className="page-width grid gap-10 page-x pb-section lg:grid-cols-12">
        <nav aria-label="Temas" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-2 lg:sticky lg:top-28 lg:flex-col">
            {faq.map((s) => (
              <li key={s.section}>
                <a
                  href={`#${s.section.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-block rounded-full border border-hairline bg-card px-4 py-2 label-caps-sm hover:border-ink"
                >
                  {s.section}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-10 lg:col-span-9">
          {faq.map((s) => (
            <section key={s.section} id={s.section.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-28">
              <h2 className="font-serif text-headline-sm italic">{s.section.toLowerCase()}</h2>
              <div className="mt-4 space-y-2">
                {s.items.map((i) => (
                  <details key={i.q} className="group overflow-hidden rounded-xl border border-hairline bg-card">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-body-md font-medium [&::-webkit-details-marker]:hidden">
                      {i.q}
                      <ChevronDown
                        size={16}
                        strokeWidth={1.25}
                        className="shrink-0 transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <p className="px-5 pb-5 text-body-md text-stone-text">{i.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="flex flex-col gap-3 rounded-2xl bg-sand p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-md">¿Tenés otra consulta?</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink("¡Hola! Tengo una consulta.")}
                target="_blank"
                rel="noopener noreferrer"
                className={button.primary}
              >
                <WhatsAppIcon /> Escribinos
              </a>
              <Link href="/envios-y-cambios" className={button.outline}>
                Envíos y cambios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
