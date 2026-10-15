import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { eyebrow } from "@/components/ui";
import { formatGs } from "@/lib/format";
import { categories, categoryOf, getProduct, inStock, products } from "@/lib/products";
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
  const isApparel = category.group === "ropa";
  // Completá tu look: accesorios para la ropa y ropa para los accesorios, priorizando la misma colección.
  const sharesCollection = (p: (typeof products)[number]) => p.collections.some((c) => product.collections.includes(c));
  const complements = products
    .filter((p) => categoryOf(p).group !== category.group && inStock(p))
    .sort((a, b) => Number(sharesCollection(b)) - Number(sharesCollection(a)) || b.sold - a.sold)
    .slice(0, 4);
  const similar = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);

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
            <h2 id="completa-tu-look" className="mt-2 font-serif text-headline-md lowercase italic">
              completá tu look
            </h2>
          </div>
          <Link
            href={`/catalogo?grupo=${isApparel ? "accesorios" : "ropa"}`}
            className="shrink-0 link-editorial label-caps whitespace-nowrap"
          >
            Ver todo
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-gutter-mobile gap-y-8 md:gap-x-gutter lg:grid-cols-4">
          {complements.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {similar.length > 0 && (
        <section className="page-width mt-section page-x" aria-labelledby="tambien-te-puede-gustar">
          <p className={eyebrow}>{category.label}</p>
          <h2 id="tambien-te-puede-gustar" className="mt-2 font-serif text-headline-md lowercase italic">
            también te puede gustar
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-x-gutter-mobile gap-y-8 md:gap-x-gutter lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
