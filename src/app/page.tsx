import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Ruler, Star } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { SizeAssistant } from "@/components/SizeAssistant";
import { button, card, eyebrow, sectionTitle } from "@/components/ui";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { formatGs } from "@/lib/format";
import { img } from "@/lib/images";
import { collections, getProduct, products } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { storeJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const steps = [
  {
    title: "Elegí tus favoritos",
    body: "Navegá las piezas exclusivas y agregalas a tu bolsa virtual en un clic.",
  },
  {
    title: "Coordinación por WhatsApp",
    body: "Al finalizar, tu pedido se envía armado a nuestro WhatsApp para confirmar stock y entrega.",
  },
  {
    title: "Pago flexible y entrega express",
    body: "Pagá por transferencia, billetera o al recibir. Envío a domicilio o retiro en el atelier.",
  },
];

const reviews = [
  {
    text: "El lino es de una calidad superior. Las asesoras por WhatsApp me ayudaron con el talle y llegó en el día.",
    name: "Valeria M.",
    place: "Villa Morra, Asunción",
  },
  {
    text: "Fui a retirar al atelier y la atención fue hermosa. Ya es mi lugar para encontrar prendas que nadie más tiene.",
    name: "Camila Benítez",
    place: "Lambaré",
  },
];

const instagram = [
  { src: img.ig1, alt: "Detalle de vestido de lino" },
  { src: img.ig2, alt: "Percheros del atelier con prendas en tonos neutros" },
  { src: img.ig3, alt: "Prendas de lino dobladas junto a una taza de café" },
  { src: img.ig4, alt: "Clienta con conjunto terracota en la calle" },
  { src: img.ig5, alt: "Detalle de botones de madera" },
  { src: img.ig6, alt: "Clienta sonriendo en el probador de la boutique" },
];

export default function Home() {
  const latest = [...products]
    .filter((p) => p.category !== "accesorios")
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, 4);
  const featured = getProduct("blazer-sastre-lino-marfil")!;

  return (
    <>
      <JsonLd data={storeJsonLd()} />
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78svh] min-h-[520px] w-full md:h-[86svh]">
          <Image
            src={img.heroAtelier}
            alt="Mujer con vestido de lino crudo caminando por un patio soleado"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 page-width page-x pb-10 text-white md:pb-16">
          <p className="label-caps-sm">Edición primavera · verano</p>
          <h1 className="mt-3 max-w-2xl font-serif text-display-mobile lowercase italic md:text-display">
            nueva colección & siluetas serenas
          </h1>
          <p className="mt-4 max-w-md text-body-lg">
            Prendas con alma, diseñadas para despertar tu elegancia natural con texturas nobles.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/catalogo" className={button.light}>
              Ver colección
            </Link>
            <SizeAssistant className={button.ghostLight}>
              <Ruler size={14} strokeWidth={1.5} /> ¿Cuál es mi talle?
            </SizeAssistant>
          </div>
        </div>
      </section>

      {/* Colecciones */}
      <section className="py-section" aria-labelledby="colecciones">
        <div className="page-width flex items-end justify-between page-x">
          <div>
            <p className={eyebrow}>Explorar por</p>
            <h2 id="colecciones" className={`${sectionTitle} mt-2`}>
              categorías de autor
            </h2>
          </div>
          <p className="label-caps-sm text-stone-text">{String(collections.length).padStart(2, "0")} colecciones</p>
        </div>
        <ul className="page-width mt-8 no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto page-x md:grid md:grid-cols-5 md:gap-gutter">
          {collections.map((c) => {
            const count = products.filter((p) => p.collections.includes(c.id)).length;
            return (
              <li key={c.id} className="w-[42vw] shrink-0 snap-start md:w-auto">
                <Link href={`/catalogo?coleccion=${c.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand shadow-soft">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(min-width: 768px) 20vw, 42vw"
                      className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 label-caps">{c.label}</p>
                  <p className="text-body-sm text-stone-text">
                    {count} {count === 1 ? "pieza" : "piezas"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Novedades */}
      <section className="bg-sand py-section" aria-labelledby="novedades">
        <div className="page-width page-x">
          <div className="flex items-end justify-between">
            <div>
              <p className={eyebrow}>Selección semanal</p>
              <h2 id="novedades" className={`${sectionTitle} mt-2`}>
                novedades del atelier
              </h2>
            </div>
            <Link href="/catalogo?orden=novedades" className="shrink-0 link-editorial label-caps whitespace-nowrap">
              Ver todas
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-gutter-mobile gap-y-10 md:gap-x-gutter lg:grid-cols-4">
            {latest.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Cita */}
      <section className="page-width page-x py-section-lg text-center">
        <blockquote className="mx-auto max-w-3xl font-serif text-headline-md italic md:text-headline-lg">
          “La verdadera distinción no reside en llamar la atención, sino en permanecer en la memoria.”
        </blockquote>
        <p className="mt-6 label-caps-sm text-stone-text">Alba Atelier · Asunción</p>
      </section>

      {/* Cómo funciona */}
      <section className="bg-sand py-section" aria-labelledby="como-funciona">
        <div className="page-width grid gap-10 page-x lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className={eyebrow}>Experiencia simple & cálida</p>
            <h2 id="como-funciona" className={`${sectionTitle} mt-2`}>
              ¿cómo funciona tu compra?
            </h2>
          </div>
          <div className="lg:col-span-7">
            <ol className={`divide-y divide-hairline px-5 ${card}`}>
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-6 py-6">
                  <span className="font-serif text-headline-sm italic">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="label-caps">{s.title}</h3>
                    <p className="mt-2 text-body-md text-stone-text">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href={whatsappLink("¡Hola! Quisiera asesoramiento para elegir una prenda.")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button.primary} mt-8 w-full sm:w-auto`}
            >
              <WhatsAppIcon />
              Hablar con una asesora
            </a>
          </div>
        </div>
      </section>

      {/* Destacado */}
      <section className="page-width page-x py-section" aria-labelledby="destacado">
        <p className={eyebrow}>Aclamados</p>
        <h2 id="destacado" className={`${sectionTitle} mt-2`}>
          favoritos atemporales
        </h2>
        <div className="mt-8 grid items-center gap-8 md:grid-cols-12 md:gap-gutter">
          <Link
            href={`/prenda/${featured.slug}`}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand shadow-soft md:col-span-7"
          >
            <Image
              src={featured.images[0].src}
              alt={featured.images[0].alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
            <span className="absolute top-3 left-3 rounded-sm bg-ink px-2 py-1 label-caps-sm text-white">
              Best seller
            </span>
          </Link>
          <div className="md:col-span-5 md:pl-8">
            <p className="label-caps-sm text-bronze">Prenda icónica</p>
            <h3 className="mt-2 font-serif text-headline-md lowercase italic">{featured.name}</h3>
            <p className="mt-4 text-body-lg text-stone-text">{featured.description[0]}</p>
            <p className="mt-6 text-price">{formatGs(featured.price)}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={`/prenda/${featured.slug}`} className={button.primary}>
                Ver prenda
              </Link>
              <a
                href={whatsappLink(
                  `¡Hola! Me interesa el ${featured.name} (${formatGs(featured.price)}). ¿Qué talles tienen disponibles?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={button.whatsappOutline}
              >
                <WhatsAppIcon />
                Pedir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="bg-sand py-section" aria-labelledby="resenas">
        <div className="page-width page-x">
          <p className={eyebrow}>Experiencias reales</p>
          <h2 id="resenas" className={`${sectionTitle} mt-2`}>
            voces de nuestras clientas
          </h2>
          <div className="mt-8 grid gap-gutter-mobile md:grid-cols-2 md:gap-gutter">
            {reviews.map((r) => (
              <figure key={r.name} className={`p-6 md:p-8 ${card}`}>
                <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} strokeWidth={1} className="fill-ink" />
                  ))}
                </div>
                <blockquote className="mt-4 font-serif text-title italic">“{r.text}”</blockquote>
                <figcaption className="mt-6 flex justify-between">
                  <span className="label-caps-sm">{r.name}</span>
                  <span className="text-body-sm text-stone-text">{r.place}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="page-width page-x py-section" aria-labelledby="instagram">
        <div className="flex items-end justify-between">
          <div>
            <p className={eyebrow}>Comunidad visual</p>
            <h2 id="instagram" className={`${sectionTitle} mt-2`}>
              @{site.instagram}
            </h2>
          </div>
          <a
            href={`https://instagram.com/${site.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 link-editorial label-caps"
          >
            Seguir <ArrowUpRight size={14} strokeWidth={1.25} />
          </a>
        </div>
        <ul className="mt-8 grid grid-cols-3 gap-1 md:grid-cols-6">
          {instagram.map((p) => (
            <li key={p.src} className="relative aspect-square overflow-hidden rounded-xl bg-sand">
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover" />
            </li>
          ))}
        </ul>
      </section>

      {/* Boutique */}
      <section id="boutique" className="scroll-mt-24 bg-sand py-section" aria-labelledby="atelier">
        <div className="page-width grid gap-8 page-x lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <p className={eyebrow}>Visitanos en persona</p>
            <h2 id="atelier" className={`${sectionTitle} mt-2`}>
              atelier villa morra
            </h2>
            <p className="mt-4 text-body-lg text-stone-text">
              Un espacio íntimo y acogedor, creado para probarte tus prendas preferidas con asesoramiento exclusivo.
            </p>
            <dl className={`mt-8 divide-y divide-hairline px-5 text-body-md ${card}`}>
              {[
                ["Dirección", `${site.address.street}, ${site.address.detail}, ${site.address.city}`],
                ["Horarios", site.hours],
                ["Estacionamiento", site.parking],
                ["WhatsApp", site.whatsappDisplay],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3">
                  <dt className="label-caps-sm text-stone-text">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button.primary} mt-8 w-full sm:w-auto`}
            >
              <MapPin size={16} strokeWidth={1.25} />
              Cómo llegar al atelier
            </a>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-2xl border border-hairline shadow-soft lg:col-span-7">
            <iframe
              title="Mapa del atelier en Villa Morra, Asunción"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.mapsQuery)}&output=embed`}
              className="absolute inset-0 h-full w-full grayscale-[60%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
