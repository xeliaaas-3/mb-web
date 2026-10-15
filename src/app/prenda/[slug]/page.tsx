import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { eyebrow } from "@/components/ui";
import { formatGs } from "@/lib/format";
import { categories, getProduct, products } from "@/lib/products";
import { site } from "@/lib/site";
import { productJsonLd } from "@/lib/structuredData";
import { Gallery } from "./Gallery";
import { PurchasePanel } from "./PurchasePanel";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/prenda/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = product.name.charAt(0).toUpperCase() + product.name.slice(1);
  return {
    title,
    description: `${title} · ${product.material} · ${formatGs(product.price)}. ${product.description[0]}`,
    alternates: { canonical: `/prenda/${product.slug}` },
    openGraph: { type: "website", images: [{ url: product.images[0].src, alt: product.images[0].alt }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/prenda/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.category)!;
  const complements = products.filter((p) => p.category === "accesorios" && p.slug !== product.slug).slice(0, 2);
  const related =
    complements.length > 0
      ? complements
      : products.filter((p) => p.category !== "accesorios" && p.slug !== product.slug).slice(0, 2);

  const details = [
    { title: "Descripción & calce", content: product.description, open: true },
    {
      title: "Cuidados de la prenda",
      content: [
        "Lavar a mano con agua fría y jabón suave para prendas delicadas.",
        "No retorcer ni escurrir con fuerza para preservar el hilado natural.",
        "Secar extendido horizontalmente a la sombra.",
        "Planchar del revés a temperatura media mientras la prenda aún esté ligeramente húmeda.",
      ],
    },
    {
      title: "Envíos y retiro en boutique",
      content: [
        `Retiro gratuito en ${site.address.street}, ${site.address.city}. ${site.hours}.`,
        "Gran Asunción: delivery en 12 a 24 hs.",
        "Interior del país: por transportadora AEX / NSA o encomienda, a coordinar.",
        `Cambios dentro de los ${site.exchangeDays} días, con etiqueta y sin uso.`,
      ],
    },
  ];

  return (
    <div className="pb-section">
      <JsonLd data={productJsonLd(product)} />
      <nav aria-label="Ruta" className="page-width page-x py-4 label-caps-sm text-stone-text">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-ink">
              Inicio
            </Link>{" "}
            /
          </li>
          <li>
            <Link href="/catalogo" className="hover:text-ink">
              Colección
            </Link>{" "}
            /
          </li>
          <li>
            <Link href={`/catalogo?categoria=${category.id}`} className="hover:text-ink">
              {category.label}
            </Link>{" "}
            /
          </li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="lg:page-width lg:grid lg:grid-cols-12 lg:gap-gutter lg:page-x">
        <div className="lg:col-span-7">
          <Gallery product={product} />
        </div>

        <div className="page-x pt-6 lg:col-span-5 lg:px-0 lg:pt-0">
          <div className="lg:sticky lg:top-28">
            <PurchasePanel product={product} />

            <div className="mt-8 space-y-2">
              {details.map((d) => (
                <details key={d.title} open={d.open} className="group overflow-hidden rounded-xl bg-sand">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 label-caps [&::-webkit-details-marker]:hidden">
                    {d.title}
                    <ChevronDown size={16} strokeWidth={1.25} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-3 px-5 pb-5 text-body-md text-stone-text">
                    {d.content.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="page-width mt-section page-x" aria-labelledby="completa-tu-look">
        <div className="flex items-end justify-between">
          <div>
            <p className={eyebrow}>Curaduría</p>
            <h2 id="completa-tu-look" className="mt-2 font-serif text-headline-md lowercase">
              completá tu look
            </h2>
          </div>
          <Link href="/catalogo?categoria=accesorios" className="shrink-0 link-editorial label-caps whitespace-nowrap">
            Ver todo
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-gutter-mobile md:gap-gutter lg:grid-cols-4">
          {related.map((p) => (
            <li key={p.slug}>
              <Link href={`/prenda/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand shadow-soft">
                  <Image
                    src={p.images[0].src}
                    alt={p.images[0].alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-white shadow-soft">
                    <Plus size={16} strokeWidth={1.25} />
                  </span>
                </div>
                <p className="mt-3 font-serif text-title lowercase">{p.name}</p>
                <p className="text-price text-stone-text">{formatGs(p.price)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
