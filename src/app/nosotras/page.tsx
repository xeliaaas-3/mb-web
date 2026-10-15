import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gem, HeartHandshake, Leaf } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { button, card, eyebrow, sectionTitle } from "@/components/ui";
import { photo } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotras",
  description: `La historia de ${site.name}: moda femenina curada en Asunción, con atención personalizada.`,
  alternates: { canonical: "/nosotras" },
};

const values = [
  {
    Icon: Gem,
    title: "Curaduría",
    body: "Elegimos cada prenda una a una: buenas telas, cortes que favorecen y piezas que se usan muchas temporadas.",
  },
  {
    Icon: HeartHandshake,
    title: "Atención cercana",
    body: "Te asesoramos con el talle, te mandamos fotos reales y te acompañamos hasta que la prenda llega a tus manos.",
  },
  {
    Icon: Leaf,
    title: "Fibras nobles",
    body: "Priorizamos lino, algodón y tejidos naturales, pensados para el clima de Paraguay.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrowText="Nuestra historia" title={`somos ${site.shortName.toLowerCase()}`}>
        Una boutique nacida en Asunción para mujeres que buscan prendas lindas, cómodas y que duren. Empezamos con un
        perchero y un WhatsApp; hoy tenemos un showroom en {site.address.detail} y clientas en todo el país.
      </PageHeader>

      <section className="page-width page-x pb-section">
        <div className="grid gap-gutter-mobile md:grid-cols-2 md:gap-gutter">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
            <Image
              src={photo.rack}
              alt="Perchero con blusas estampadas"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
            <Image
              src={photo.boutiqueInterior}
              alt="Interior del showroom"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-sand py-section" aria-labelledby="valores">
        <div className="page-width page-x">
          <p className={eyebrow}>Lo que nos importa</p>
          <h2 id="valores" className={`${sectionTitle} mt-2`}>
            nuestros valores
          </h2>
          <ul className="mt-8 grid gap-gutter-mobile md:grid-cols-3 md:gap-gutter">
            {values.map(({ Icon, title, body }) => (
              <li key={title} className={`p-6 md:p-8 ${card}`}>
                <Icon size={24} strokeWidth={1.25} className="text-bronze" />
                <h3 className="mt-4 font-serif text-headline-sm italic">{title.toLowerCase()}</h3>
                <p className="mt-2 text-body-md text-stone-text">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-width page-x py-section text-center">
        <h2 className={sectionTitle}>vení a conocernos</h2>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-stone-text">
          {site.address.street}, {site.address.detail}. {site.hours}.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/catalogo" className={button.primary}>
            Ver la colección
          </Link>
          <Link href="/contacto" className={button.outline}>
            Contacto
          </Link>
        </div>
      </section>
    </>
  );
}
