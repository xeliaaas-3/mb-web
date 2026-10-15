import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { categories } from "@/lib/products";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-sand pb-24 lg:pb-0">
      <div className="page-width grid gap-10 page-x py-section md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-headline-sm lowercase">{site.name.toLowerCase()}</p>
          <p className="mt-3 max-w-sm text-body-md text-stone-text">
            Moda femenina de autor en lino, seda y algodón. Curada en Asunción, enviada a todo Paraguay.
          </p>
        </div>
        <div>
          <p className="label-caps-sm text-stone-text">Colección</p>
          <ul className="mt-4 space-y-2 text-body-md">
            {categories.map((c) => (
              <li key={c.id}>
                <Link className="link-editorial" href={`/catalogo?categoria=${c.id}`}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label-caps-sm text-stone-text">Contacto</p>
          <ul className="mt-4 space-y-2 text-body-md">
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
              {site.address.street}, {site.address.city}
            </li>
            <li className="text-stone-text">{site.hours}</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-hairline page-x py-6 text-center text-body-sm text-stone-text">
        © {new Date().getFullYear()} {site.name} · Paraguay
      </p>
    </footer>
  );
}
