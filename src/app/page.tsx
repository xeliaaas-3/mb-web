import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CreditCard, Gift, MapPin, RefreshCw, Ruler, Star, Store, Truck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { SizeAssistant } from "@/components/SizeAssistant";
import { button, card, eyebrow, sectionTitle } from "@/components/ui";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { benefits, looks, reviews } from "@/lib/content";
import { formatGs } from "@/lib/format";
import { isOptimizable, photo } from "@/lib/images";
import { getProducts } from "@/lib/catalog";
import { bestSellers, categories, categoryOf, collections, findProduct, newest } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { storeJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const benefitIcons = [Truck, CreditCard, RefreshCw, Store];

const steps = [
  { title: "Elegí tus favoritos", body: "Agregá las prendas a tu bolsa con el talle que querés." },
  { title: "Envianos tu pedido", body: "Se abre WhatsApp con tu pedido armado y una asesora confirma stock." },
  { title: "Pagá y recibí", body: "Transferencia, billetera o al recibir. Delivery, encomienda o retiro." },
];

const instagram = [
  { src: photo.whiteDressStreet, alt: "Clienta con vestido blanco en la ciudad" },
  { src: photo.floralField, alt: "Vestido floral en el campo" },
  { src: photo.whiteBlouseBasket, alt: "Blusa blanca y canasto tejido" },
  { src: photo.greenSlipPalms, alt: "Vestido esmeralda entre palmeras" },
  { src: photo.chocolateSatinDress, alt: "Vestido de satén chocolate en el estudio" },
  { src: photo.beachDress, alt: "Vestido beige caminando por la playa" },
];

function SectionHeader({
  eyebrowText,
  title,
  id,
  href,
  linkText,
}: {
  eyebrowText: string;
  title: string;
  id: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className={eyebrow}>{eyebrowText}</p>
        <h2 id={id} className={`${sectionTitle} mt-2`}>
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="shrink-0 link-editorial label-caps whitespace-nowrap">
          {linkText ?? "Ver todo"}
        </Link>
      )}
    </div>
  );
}

const productGrid = "mt-8 grid grid-cols-2 gap-x-gutter-mobile gap-y-10 md:gap-x-gutter lg:grid-cols-4";

export default async function Home() {
  const products = await getProducts();
  const look = looks[0];
  const lookProducts = look.products.flatMap((slug) => findProduct(products, slug) ?? []);
  const accessories = [...products]
    .filter((p) => categoryOf(p).group === "accesorios")
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);
  const sale = products.filter((p) => p.compareAt);
  const maxDiscount = Math.max(0, ...sale.map((p) => Math.round((1 - p.price / p.compareAt!) * 100)));
  const featuredCollections = collections.filter((c) => ["verano", "fiesta", "oficina", "tejidos"].includes(c.id));

  return (
    <>
      <JsonLd data={storeJsonLd()} />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78svh] min-h-[520px] w-full md:h-[86svh]">
          {/* Foto vertical en el celular y horizontal en pantallas grandes. */}
          <Image
            src={photo.whiteDressStreet}
            alt="Mujer con vestido blanco en la ciudad"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_20%] md:hidden"
          />
          <Image
            src={photo.hero}
            alt="Mujer con vestido floral cruzado y canasto tejido junto al mar"
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-[50%_35%] md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black/45 via-black/10 to-transparent md:block" />
        </div>
        <div className="absolute inset-x-0 bottom-0 page-width page-x pb-10 text-white md:pb-16">
          <p className="label-caps-sm">Colección primavera · verano</p>
          <h1 className="mt-3 max-w-2xl font-serif text-display-mobile lowercase italic md:text-display">
            elegancia atemporal para cada ocasión
          </h1>
          <p className="mt-4 max-w-md text-body-lg">
            Vestidos, sastrería y accesorios seleccionados uno a uno. Comprá online y coordiná por WhatsApp.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/catalogo?coleccion=nuevos" className={button.light}>
              Ver nuevos ingresos
            </Link>
            <SizeAssistant className={button.ghostLight}>
              <Ruler size={14} strokeWidth={1.5} /> ¿Cuál es mi talle?
            </SizeAssistant>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section aria-label="Beneficios" className="border-b border-hairline bg-card">
        <ul className="page-width no-scrollbar flex snap-x gap-6 overflow-x-auto page-x py-5 md:grid md:grid-cols-4">
          {benefits.map((b, i) => {
            const Icon = benefitIcons[i];
            return (
              <li key={b.title} className="flex min-w-[240px] snap-start items-start gap-3 md:min-w-0">
                <Icon size={20} strokeWidth={1.25} className="mt-0.5 shrink-0 text-bronze" />
                <span>
                  <span className="block text-body-md font-medium">{b.title}</span>
                  <span className="text-body-sm text-stone-text">{b.body}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Categorías */}
      <section className="py-section" aria-labelledby="categorias">
        <div className="page-width page-x">
          <SectionHeader eyebrowText="Comprar por" title="categorías" id="categorias" href="/catalogo" />
        </div>
        <ul className="page-width mt-8 no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto page-x md:gap-gutter">
          {categories.map((c) => {
            const items = products.filter((p) => p.category === c.id);
            const cover = [...items].sort((a, b) => b.sold - a.sold)[0];
            if (!cover) return null;
            return (
              <li key={c.id} className="w-[38vw] shrink-0 snap-start sm:w-48">
                <Link href={`/catalogo?categoria=${c.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand shadow-soft">
                    <Image
                      src={cover.images[0].src}
                      unoptimized={!isOptimizable(cover.images[0].src)}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 192px, 38vw"
                      className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 font-serif text-title italic">{c.label}</p>
                  <p className="text-body-sm text-stone-text">
                    {items.length} {items.length === 1 ? "pieza" : "piezas"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Nuevos ingresos */}
      <section className="bg-sand py-section" aria-labelledby="nuevos">
        <div className="page-width page-x">
          <SectionHeader
            eyebrowText="Recién llegados"
            title="nuevos ingresos"
            id="nuevos"
            href="/catalogo?coleccion=nuevos"
          />
          <div className={productGrid}>
            {newest(products, 8).map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* Colecciones */}
      <section className="page-width page-x py-section" aria-labelledby="colecciones">
        <SectionHeader eyebrowText="Para cada momento" title="colecciones" id="colecciones" />
        <ul className="mt-8 grid gap-gutter-mobile sm:grid-cols-2 md:gap-gutter">
          {featuredCollections.map((c) => (
            <li key={c.id}>
              <Link
                href={`/catalogo?coleccion=${c.id}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-sand shadow-soft md:aspect-[16/11]"
              >
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-serif text-headline-md italic">{c.label.toLowerCase()}</h3>
                  <p className="mt-1 text-body-md text-white/85">{c.description}</p>
                  <span className="mt-3 inline-flex items-center gap-2 label-caps">
                    Descubrir <ArrowRight size={14} strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Más vendidos */}
      <section className="bg-sand py-section" aria-labelledby="mas-vendidos">
        <div className="page-width page-x">
          <SectionHeader
            eyebrowText="Las favoritas de nuestras clientas"
            title="más vendidos"
            id="mas-vendidos"
            href="/catalogo?orden=mas-vendidos"
          />
          <div className={productGrid}>
            {bestSellers(products, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Sale */}
      <section className="page-width page-x py-section" aria-labelledby="sale">
        <div className="grid overflow-hidden rounded-3xl bg-ink text-white md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="label-caps-sm text-white/70">Sale de temporada</p>
            <h2 id="sale" className="mt-3 font-serif text-display-mobile italic md:text-display">
              hasta {maxDiscount}% off
            </h2>
            <p className="mt-3 max-w-sm text-body-lg text-white/80">
              {sale.length} prendas seleccionadas con descuento. Hasta agotar stock.
            </p>
            <Link href="/catalogo?coleccion=sale" className={`${button.light} mt-8 self-start`}>
              Ver sale
            </Link>
          </div>
          <div className="relative min-h-72">
            <Image
              src={photo.mustardButtonDress}
              alt="Vestido mostaza en oferta"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section className="bg-sand py-section" aria-labelledby="lookbook">
        <div className="page-width page-x">
          <SectionHeader
            eyebrowText="Lookbook"
            title="comprá el look"
            id="lookbook"
            href="/lookbook"
            linkText="Ver lookbook"
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-gutter">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft lg:col-span-5">
              <Image
                src={look.image}
                alt={look.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-7">
              <h3 className="font-serif text-headline-md italic">{look.title}</h3>
              <p className="mt-2 text-body-lg text-stone-text">{look.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-x-gutter-mobile gap-y-8 md:gap-x-gutter">
                {lookProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accesorios */}
      <section className="page-width page-x py-section" aria-labelledby="accesorios">
        <SectionHeader
          eyebrowText="El toque final"
          title="accesorios"
          id="accesorios"
          href="/catalogo?grupo=accesorios"
        />
        <div className={productGrid}>
          {accessories.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Gift card */}
      <section className="page-width page-x pb-section" aria-labelledby="gift-card">
        <div
          className={`flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12 ${card}`}
        >
          <div className="flex items-start gap-5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-sand">
              <Gift size={24} strokeWidth={1.25} className="text-bronze" />
            </span>
            <div>
              <h2 id="gift-card" className="font-serif text-headline-md italic">
                regalá {site.shortName.toLowerCase()}
              </h2>
              <p className="mt-1 max-w-md text-body-md text-stone-text">
                Gift cards desde {formatGs(100000)}, digitales o impresas en el showroom. Para cumpleaños, aniversarios
                o porque sí.
              </p>
            </div>
          </div>
          <Link href="/gift-card" className={button.primary}>
            Elegir gift card
          </Link>
        </div>
      </section>

      {/* Cómo comprar */}
      <section className="bg-sand py-section" aria-labelledby="como-funciona">
        <div className="page-width grid gap-10 page-x lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className={eyebrow}>Simple y cercano</p>
            <h2 id="como-funciona" className={`${sectionTitle} mt-2`}>
              ¿cómo comprar?
            </h2>
            <p className="mt-4 max-w-sm text-body-lg text-stone-text">
              Sin cuentas ni contraseñas: elegís, nos escribís y una asesora te acompaña hasta que lo recibís.
            </p>
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink("¡Hola! Quisiera asesoramiento para elegir una prenda.")}
                target="_blank"
                rel="noopener noreferrer"
                className={button.primary}
              >
                <WhatsAppIcon />
                Hablar con una asesora
              </a>
              <Link href="/preguntas-frecuentes" className={button.outline}>
                Preguntas frecuentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="page-width page-x py-section" aria-labelledby="resenas">
        <SectionHeader eyebrowText="Experiencias reales" title="lo que dicen nuestras clientas" id="resenas" />
        <div className="mt-8 grid gap-gutter-mobile md:grid-cols-3 md:gap-gutter">
          {reviews.map((r) => (
            <figure key={r.name} className={`flex flex-col p-6 md:p-8 ${card}`}>
              <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} strokeWidth={1} className="fill-bronze text-bronze" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-serif text-title italic">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex justify-between gap-3">
                <span className="label-caps-sm">{r.name}</span>
                <span className="text-body-sm text-stone-text">{r.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="page-width page-x pb-section" aria-labelledby="instagram">
        <SectionHeader eyebrowText="Comunidad" title={`@${site.instagram}`} id="instagram" />
        <ul className="mt-8 grid grid-cols-3 gap-1.5 md:grid-cols-6">
          {instagram.map((p) => (
            <li key={p.src} className="relative aspect-square overflow-hidden rounded-xl bg-sand">
              <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover" />
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`https://instagram.com/${site.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1 link-editorial label-caps"
        >
          Seguinos en Instagram <ArrowUpRight size={14} strokeWidth={1.25} />
        </a>
      </section>

      {/* Showroom */}
      <section id="boutique" className="scroll-mt-24 bg-sand py-section" aria-labelledby="showroom">
        <div className="page-width grid gap-8 page-x lg:grid-cols-12 lg:gap-gutter">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft lg:col-span-7 lg:aspect-auto">
            <Image
              src={photo.boutiqueInterior}
              alt="Interior del showroom con percheros y espejo"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-5">
            <p className={eyebrow}>Visitanos</p>
            <h2 id="showroom" className={`${sectionTitle} mt-2`}>
              showroom {site.address.detail.toLowerCase()}
            </h2>
            <p className="mt-4 text-body-lg text-stone-text">
              Un espacio íntimo para probarte tus prendas con asesoramiento personalizado y un café.
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={button.primary}
              >
                <MapPin size={16} strokeWidth={1.25} />
                Cómo llegar
              </a>
              <a
                href={whatsappLink("¡Hola! Quisiera agendar una visita al showroom.")}
                target="_blank"
                rel="noopener noreferrer"
                className={button.outline}
              >
                Agendar visita
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de difusión */}
      <section className="page-width page-x py-section text-center" aria-labelledby="novedades-whatsapp">
        <p className={eyebrow}>Novedades primero</p>
        <h2 id="novedades-whatsapp" className={`${sectionTitle} mt-2`}>
          sumate a nuestra lista de difusión
        </h2>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-stone-text">
          Recibí los nuevos ingresos, el sale y preventas exclusivas directo en tu WhatsApp. Sin spam.
        </p>
        <a
          href={whatsappLink("¡Hola! Quiero sumarme a la lista de difusión de novedades.")}
          target="_blank"
          rel="noopener noreferrer"
          className={`${button.whatsapp} mt-8`}
        >
          <WhatsAppIcon />
          Quiero sumarme
        </a>
      </section>
    </>
  );
}
