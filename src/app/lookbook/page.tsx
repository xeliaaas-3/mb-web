import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { looks } from "@/lib/content";
import { formatGs } from "@/lib/format";
import { getProducts } from "@/lib/catalog";
import { findProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Looks completos armados por nuestras asesoras. Comprá cada prenda por separado.",
  alternates: { canonical: "/lookbook" },
};

export default async function LookbookPage() {
  const products = await getProducts();
  return (
    <>
      <PageHeader eyebrowText="Lookbook" title="ideas para vestirte">
        Looks completos armados por nuestras asesoras. Agregá a tu bolsa solo lo que te guste.
      </PageHeader>

      <div className="page-width space-y-section page-x pb-section">
        {looks.map((look, i) => {
          const items = look.products.flatMap((slug) => findProduct(products, slug) ?? []);
          const total = items.reduce((n, p) => n + p.price, 0);
          return (
            <section key={look.id} id={look.id} aria-labelledby={`look-${look.id}`} className="scroll-mt-24">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-gutter">
                <div
                  className={`relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}
                >
                  <Image
                    src={look.image}
                    alt={look.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-7">
                  <p className="label-caps-sm text-stone-text">Look {String(i + 1).padStart(2, "0")}</p>
                  <h2
                    id={`look-${look.id}`}
                    className="mt-2 font-serif text-headline-lg-mobile italic md:text-headline-lg"
                  >
                    {look.title}
                  </h2>
                  <p className="mt-2 text-body-lg text-stone-text">{look.description}</p>
                  <p className="mt-2 text-body-sm text-stone-text">Look completo: {formatGs(total)}</p>
                  <div className="mt-6 grid grid-cols-2 gap-x-gutter-mobile gap-y-8 md:gap-x-gutter">
                    {items.map((p) => (
                      <ProductCard key={p.slug} product={p} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
