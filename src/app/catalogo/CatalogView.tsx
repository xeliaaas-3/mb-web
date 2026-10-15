"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { button, eyebrow } from "@/components/ui";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { formatGs } from "@/lib/format";
import { categories, collections, products, type Product } from "@/lib/products";
import { whatsappLink } from "@/lib/site";

const PAGE_SIZE = 8;
const PRICE_STEP = 10000;
const maxCatalogPrice = Math.ceil(Math.max(...products.map((p) => p.price)) / 50000) * 50000;
const minCatalogPrice = Math.floor(Math.min(...products.map((p) => p.price)) / 50000) * 50000;

const sorts = {
  novedades: { label: "Novedades", fn: (a: Product, b: Product) => b.addedAt - a.addedAt },
  "precio-asc": { label: "Menor precio", fn: (a: Product, b: Product) => a.price - b.price },
  "precio-desc": { label: "Mayor precio", fn: (a: Product, b: Product) => b.price - a.price },
} as const;
type SortId = keyof typeof sorts;

const allSizes = [...new Set(products.flatMap((p) => p.sizes.map((s) => s.label)))];
const allColors = [...new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function CatalogView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filtersRef = useRef<HTMLDialogElement>(null);

  const categoria = params.get("categoria") ?? "";
  const coleccion = params.get("coleccion") ?? "";
  const orden = (params.get("orden") as SortId) in sorts ? (params.get("orden") as SortId) : "novedades";
  const talles = params.getAll("talle");
  const colores = params.getAll("color");
  const max = Number(params.get("max")) || maxCatalogPrice;
  const searchFocused = params.has("buscar");
  const [query, setQuery] = useState(params.get("buscar") ?? "");
  const [visible, setVisible] = useState(PAGE_SIZE);

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    setVisible(PAGE_SIZE);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleMulti(key: string, value: string) {
    update((p) => {
      const current = p.getAll(key);
      p.delete(key);
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      next.forEach((v) => p.append(key, v));
    });
  }

  const q = normalize(query.trim());
  const results = products
    .filter((p) => !categoria || p.category === categoria)
    .filter((p) => !coleccion || p.collections.includes(coleccion as never))
    .filter((p) => !talles.length || p.sizes.some((s) => s.stock > 0 && talles.includes(s.label)))
    .filter((p) => !colores.length || p.colors.some((c) => colores.includes(c.name)))
    .filter((p) => p.price <= max)
    .filter((p) => !q || normalize(`${p.name} ${p.material} ${p.colors.map((c) => c.name).join(" ")}`).includes(q))
    .sort(sorts[orden].fn);

  const activeFilters = talles.length + colores.length + (max < maxCatalogPrice ? 1 : 0);
  const collectionLabel = collections.find((c) => c.id === coleccion)?.label;
  const heading = categories.find((c) => c.id === categoria)?.label ?? collectionLabel ?? "Toda la colección";

  const tabs = [{ id: "", label: "Todos" }, ...categories];

  return (
    <div className="page-width page-x pt-6 pb-section md:pt-10">
      <label className="flex h-12 items-center gap-3 rounded-xl border border-hairline bg-card px-4 shadow-soft focus-within:border-ink">
        <Search size={18} strokeWidth={1.25} className="text-stone-text" />
        <span className="sr-only">Buscar</span>
        <input
          type="search"
          value={query}
          autoFocus={searchFocused}
          onChange={(e) => {
            setQuery(e.target.value);
            update((p) => (e.target.value ? p.set("buscar", e.target.value) : p.delete("buscar")));
          }}
          placeholder="Buscar por prenda, tela o color…"
          className="h-full flex-1 bg-transparent text-body-md outline-none placeholder:text-stone-text"
        />
        {query && (
          <button
            type="button"
            aria-label="Borrar búsqueda"
            onClick={() => {
              setQuery("");
              update((p) => p.delete("buscar"));
            }}
          >
            <X size={16} strokeWidth={1.25} />
          </button>
        )}
      </label>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Catálogo curation</p>
          <h1 className="mt-2 font-serif text-headline-lg-mobile lowercase md:text-headline-lg">{heading}</h1>
        </div>
        <p className="text-body-md text-stone-text">
          {results.length} {results.length === 1 ? "prenda" : "prendas"}
        </p>
      </div>

      {collectionLabel && (
        <button
          type="button"
          onClick={() => update((p) => p.delete("coleccion"))}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink px-3 py-2 label-caps-sm"
        >
          Colección: {collectionLabel} <X size={12} strokeWidth={1.5} />
        </button>
      )}

      <nav aria-label="Categorías" className="-mx-5 mt-6 no-scrollbar flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
        {tabs.map((t) => {
          const active = categoria === t.id;
          return (
            <button
              key={t.id || "todos"}
              type="button"
              aria-pressed={active}
              onClick={() => update((p) => (t.id ? p.set("categoria", t.id) : p.delete("categoria")))}
              className={`h-10 shrink-0 rounded-full border px-5 label-caps transition-colors ${
                active ? "border-ink bg-ink text-white" : "border-hairline bg-card hover:border-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 flex items-center justify-between border-y border-hairline py-3">
        <button
          type="button"
          onClick={() => filtersRef.current?.showModal()}
          className="inline-flex items-center gap-2 label-caps"
        >
          <SlidersHorizontal size={16} strokeWidth={1.25} />
          Filtros
          {activeFilters > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-ink font-sans text-[10px] tracking-normal text-white">
              {activeFilters}
            </span>
          )}
        </button>
        <label className="relative inline-flex items-center gap-2 label-caps">
          <span className="text-stone-text">Orden:</span>
          <select
            value={orden}
            onChange={(e) => update((p) => p.set("orden", e.target.value))}
            className="cursor-pointer appearance-none bg-transparent pr-5 label-caps outline-none"
          >
            {Object.entries(sorts).map(([id, s]) => (
              <option key={id} value={id}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} strokeWidth={1.25} className="pointer-events-none absolute right-0" />
        </label>
      </div>

      {results.length === 0 ? (
        <div className="py-section text-center">
          <p className="font-serif text-headline-sm italic">no encontramos prendas con esos filtros</p>
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className={`${button.outline} mt-6`}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-gutter-mobile gap-y-10 md:gap-x-gutter lg:grid-cols-4">
          {results.slice(0, visible).map((p, i) => (
            <Fragment key={p.slug}>
              <ProductCard product={p} priority={i < 2} />
              {i === 3 && results.length > 4 && (
                <aside className="col-span-2 flex flex-col items-center justify-center rounded-2xl bg-sand px-6 py-10 text-center lg:col-span-4">
                  <p className={eyebrow}>Asesoría personalizada</p>
                  <h2 className="mt-2 font-serif text-headline-sm">¿Dudas con tu talle ideal?</h2>
                  <p className="mt-2 max-w-md text-body-md text-stone-text">
                    Te enviamos medidas exactas de cada prenda y fotos adicionales en tiempo real por WhatsApp.
                  </p>
                  <a
                    href={whatsappLink("¡Hola! Tengo una duda sobre talles, ¿me ayudan?")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${button.primary} mt-6`}
                  >
                    <WhatsAppIcon />
                    Consultar con estilista
                  </a>
                </aside>
              )}
            </Fragment>
          ))}
        </div>
      )}

      {results.length > visible && (
        <div className="mt-12 text-center">
          <p className="label-caps-sm text-stone-text">
            Mostrando {visible} de {results.length}
          </p>
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className={`${button.outline} mt-4 w-full max-w-sm`}
          >
            Cargar más prendas
          </button>
        </div>
      )}

      <dialog
        ref={filtersRef}
        aria-label="Filtros"
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-[420px] bg-canvas p-0 text-ink shadow-drawer"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
            <span className="label-caps">Filtros</span>
            <button
              type="button"
              aria-label="Cerrar filtros"
              className="-mr-2 p-2"
              onClick={() => filtersRef.current?.close()}
            >
              <X size={20} strokeWidth={1.25} />
            </button>
          </div>
          <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
            <fieldset>
              <legend className="label-caps-sm text-stone-text">Talle</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {allSizes.map((s) => {
                  const on = talles.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleMulti("talle", s)}
                      className={`h-11 min-w-11 rounded-lg border px-3 label-caps ${on ? "border-ink bg-ink text-white" : "border-hairline hover:border-ink"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className="label-caps-sm text-stone-text">Color</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {allColors.map((c) => {
                  const on = colores.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleMulti("color", c.name)}
                      className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-body-sm ${on ? "border-ink" : "border-hairline hover:border-ink"}`}
                    >
                      <span className="size-3 rounded-full border border-hairline" style={{ background: c.hex }} />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className="label-caps-sm text-stone-text">Precio máximo</legend>
              <p className="mt-3 text-price">{formatGs(max)}</p>
              <input
                type="range"
                min={minCatalogPrice}
                max={maxCatalogPrice}
                step={PRICE_STEP}
                value={max}
                onChange={(e) =>
                  update((p) =>
                    Number(e.target.value) >= maxCatalogPrice ? p.delete("max") : p.set("max", e.target.value),
                  )
                }
                className="mt-3 w-full accent-ink"
                aria-label="Precio máximo"
              />
              <div className="flex justify-between text-body-sm text-stone-text">
                <span>{formatGs(minCatalogPrice)}</span>
                <span>{formatGs(maxCatalogPrice)}</span>
              </div>
            </fieldset>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-hairline p-5">
            <button
              type="button"
              className={button.outline}
              onClick={() =>
                update((p) => {
                  p.delete("talle");
                  p.delete("color");
                  p.delete("max");
                })
              }
            >
              Limpiar
            </button>
            <button type="button" className={button.primary} onClick={() => filtersRef.current?.close()}>
              Ver {results.length}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
