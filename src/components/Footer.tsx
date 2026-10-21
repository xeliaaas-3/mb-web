import Link from "next/link";
import { paymentMethods, site, whatsappLink } from "@/lib/site";
import { menuSections } from "./nav";

const footerSections = menuSections.filter((s) => ["Comprar", "Inspiración", "Ayuda"].includes(s.title));

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-sand pb-24 lg:pb-0">
      <div className="page-width grid gap-10 page-x py-section md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-serif text-[22px] font-semibold tracking-[0.22em] uppercase">{site.shortName}</p>
          <p className="text-[9px] tracking-[0.28em] text-stone-text uppercase">Boutique | PY</p>
          <p className="mt-4 max-w-sm text-body-md text-stone-text">
            Moda femenina curada en Asunción: vestidos, sastrería y accesorios, con envíos a todo Paraguay.
          </p>
          <ul className="mt-6 space-y-1.5 text-body-md">
            <li>
              <a className="link-editorial" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                className="link-editorial"
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram @{site.instagram}
              </a>
            </li>
            <li>
              {site.address.street}, {site.address.detail}, {site.address.city}
            </li>
            <li className="text-stone-text">{site.hours}</li>
          </ul>
        </div>
        {footerSections.map((s) => (
          <nav key={s.title} aria-label={s.title}>
            <p className="label-caps-sm text-stone-text">{s.title}</p>
            <ul className="mt-4 space-y-2 text-body-md">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link className="link-editorial" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="page-width flex flex-col gap-3 border-t border-hairline page-x py-6 text-body-sm text-stone-text md:flex-row md:items-center md:justify-between">
        <p>Medios de pago: {paymentMethods.map((m) => m.split(" (")[0]).join(" · ")}</p>
        <p>
          © {new Date().getFullYear()} {site.name} · Paraguay
          {site.demo && (
            <>
              {" · "}
              <a
                className="link-editorial"
                href={`https://www.instagram.com/${site.demo.instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo desarrollada por {site.demo.by} (@{site.demo.instagram})
              </a>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
