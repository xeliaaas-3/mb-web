import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { card } from "@/components/ui";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site, whatsappLink } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: `WhatsApp, Instagram, dirección y horarios del showroom de ${site.name}.`,
  alternates: { canonical: "/contacto" },
};

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

export default function ContactPage() {
  const channels = [
    {
      icon: <WhatsAppIcon width={20} height={20} />,
      label: "WhatsApp",
      value: site.whatsappDisplay,
      href: whatsappLink("¡Hola! Tengo una consulta."),
    },
    {
      icon: <InstagramIcon />,
      label: "Instagram",
      value: `@${site.instagram}`,
      href: `https://instagram.com/${site.instagram}`,
    },
    {
      icon: <MapPin size={20} strokeWidth={1.25} />,
      label: "Showroom",
      value: `${site.address.street}, ${site.address.detail}, ${site.address.city}`,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapsQuery)}`,
    },
    { icon: <Clock size={20} strokeWidth={1.25} />, label: "Horarios", value: site.hours },
  ];

  return (
    <>
      <PageHeader eyebrowText="Estamos para ayudarte" title="contacto">
        Respondemos por WhatsApp de lunes a sábado. Para probarte prendas, agendá tu visita al showroom.
      </PageHeader>

      <div className="page-width grid gap-gutter-mobile page-x pb-section md:gap-gutter lg:grid-cols-2">
        <div className="space-y-gutter-mobile md:space-y-gutter">
          <ul className={`divide-y divide-hairline px-5 ${card}`}>
            {channels.map((c) => {
              const content = (
                <>
                  <span className="text-bronze">{c.icon}</span>
                  <span>
                    <span className="block label-caps-sm text-stone-text">{c.label}</span>
                    <span className="text-body-md">{c.value}</span>
                  </span>
                </>
              );
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 py-4 hover:text-bronze"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 py-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <ContactForm />
        </div>
        <div className="relative min-h-96 overflow-hidden rounded-2xl border border-hairline shadow-soft">
          <iframe
            title={`Mapa del showroom en ${site.address.detail}, ${site.address.city}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.mapsQuery)}&output=embed`}
            className="absolute inset-0 h-full w-full grayscale-[40%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
}
