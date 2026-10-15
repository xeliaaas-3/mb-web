import { cache } from "react";
import {
  categories,
  namedColors,
  sampleProducts,
  type Badge,
  type CategoryId,
  type CollectionTag,
  type Color,
  type Product,
  type Size,
} from "./products";

/**
 * Catálogo editable desde una Google Sheet.
 *
 * La planilla tiene una pestaña por categoría. Cada pestaña se lee como CSV: `CATALOG_SHEET_CSV_URL`
 * lleva una URL por pestaña, separadas por espacios o saltos de línea. Se vuelve a leer cada
 * `CATALOG_REFRESH_SECONDS` (5 minutos). Sin esa variable se usa el catálogo de ejemplo
 * de `products.ts`. Si la planilla falla, se sigue mostrando la última versión válida:
 * nunca se reemplaza el catálogo real por el de ejemplo.
 *
 * Columnas (la primera fila son los títulos, sin importar mayúsculas ni acentos):
 * nombre*, categoria*, precio*, precio_anterior, etiqueta, colecciones, material,
 * colores, talles, fotos*, descripcion, ingreso, vendidos, slug, activo.
 * Si una fila no tiene categoría, toma la de su pestaña (la más usada en esa pestaña).
 * Ver docs/catalogo.md para el detalle de cada una.
 */

export const CATALOG_TAG = "catalogo";
export const CATALOG_REFRESH_SECONDS = 300;

export type CatalogSource = { products: Product[]; source: "planilla" | "ejemplo"; warnings: string[] };

/** Última lectura válida de la planilla en este servidor. */
let lastGood: CatalogSource | null = null;

export const getCatalog = cache(async (): Promise<CatalogSource> => {
  const urls = (process.env.CATALOG_SHEET_CSV_URL ?? "").split(/\s+/).filter(Boolean);
  if (urls.length === 0) return { products: sampleProducts, source: "ejemplo", warnings: [] };

  try {
    const texts = await Promise.all(
      urls.map(async (url, i) => {
        const res = await fetch(url, { next: { revalidate: CATALOG_REFRESH_SECONDS, tags: [CATALOG_TAG] } });
        if (!res.ok) throw new Error(`La pestaña ${i + 1} respondió ${res.status}`);
        const text = await res.text();
        if (text.trimStart().startsWith("<")) {
          throw new Error(`La pestaña ${i + 1} no es pública o su URL no devuelve CSV`);
        }
        return text;
      }),
    );
    const seen = new Set<string>();
    const products: Product[] = [];
    const warnings: string[] = [];
    texts.forEach((text, i) => {
      const result = parseCatalogCsv(text, { seen, label: urls.length > 1 ? `Pestaña ${i + 1}, fila` : "Fila" });
      products.push(...result.products);
      warnings.push(...result.warnings);
    });
    if (warnings.length) console.warn(`[catálogo] ${warnings.length} avisos:\n- ${warnings.join("\n- ")}`);
    if (products.length === 0) throw new Error("La planilla no tiene productos válidos");
    lastGood = { products, source: "planilla", warnings };
    return lastGood;
  } catch (error) {
    if (lastGood) {
      console.error("[catálogo] No se pudo leer la planilla; se mantiene la última versión válida:", error);
      return { ...lastGood, warnings: [...lastGood.warnings, String(error)] };
    }
    // Sin una versión válida previa: el error hace que Next siga sirviendo las páginas ya generadas
    // (o que falle el deploy), en vez de publicar productos de ejemplo como si fueran reales.
    throw new Error(`[catálogo] No se pudo leer la planilla: ${error instanceof Error ? error.message : error}`);
  }
});

export async function getProducts() {
  return (await getCatalog()).products;
}

// ——— Lectura del CSV ———

/** CSV estándar (RFC 4180): comillas dobles, comas y saltos de línea dentro de celdas. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

export const slugify = (s: string) =>
  norm(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const columnAliases: Record<string, string[]> = {
  slug: ["slug", "id", "codigo"],
  name: ["nombre", "prenda", "producto"],
  category: ["categoria"],
  price: ["precio"],
  compareAt: ["precio anterior", "precio_anterior", "precio antes", "antes"],
  badge: ["etiqueta"],
  collections: ["colecciones", "coleccion"],
  material: ["material", "tela"],
  colors: ["colores", "color"],
  sizes: ["talles", "talle", "stock"],
  images: ["fotos", "foto", "imagenes"],
  description: ["descripcion"],
  addedAt: ["ingreso", "fecha", "fecha ingreso", "fecha de ingreso"],
  sold: ["vendidos"],
  active: ["activo", "visible", "publicar"],
};

const categoryAliases: [string, CategoryId][] = [
  ["vestido", "vestidos"],
  ["blusa", "blusas"],
  ["top", "blusas"],
  ["camisa", "blusas"],
  ["remera", "blusas"],
  ["pantalon", "pantalones"],
  ["jean", "pantalones"],
  ["falda", "faldas"],
  ["pollera", "faldas"],
  ["conjunto", "conjuntos"],
  ["traje", "conjuntos"],
  ["mono", "monos"],
  ["enterito", "monos"],
  ["blazer", "abrigos"],
  ["abrigo", "abrigos"],
  ["tapado", "abrigos"],
  ["saco", "abrigos"],
  ["cartera", "carteras"],
  ["bolso", "carteras"],
  ["bijou", "bijouterie"],
  ["joya", "bijouterie"],
  ["calzado", "calzado"],
  ["zapato", "calzado"],
  ["zapatilla", "calzado"],
  ["sandalia", "calzado"],
  ["accesorio", "accesorios"],
  ["sombrero", "accesorios"],
  ["cinto", "accesorios"],
  ["lente", "accesorios"],
];

function parseCategory(value: string): CategoryId | null {
  const v = norm(value);
  const exact = categories.find((c) => c.id === v || norm(c.label) === v);
  if (exact) return exact.id;
  return categoryAliases.find(([prefix]) => v.startsWith(prefix))?.[1] ?? null;
}

const badgeAliases: Record<string, Badge> = {
  nuevo: "nuevo",
  "mas vendido": "mas-vendido",
  "mas-vendido": "mas-vendido",
  "best seller": "mas-vendido",
  ultimas: "ultimas",
  "ultimas unidades": "ultimas",
  "edicion especial": "edicion-especial",
  exclusivo: "edicion-especial",
  oferta: "oferta",
  sale: "oferta",
};

const collectionTags: CollectionTag[] = ["verano", "fiesta", "oficina", "tejidos"];

const parseMoney = (v: string) => {
  const digits = v.replace(/[^\d]/g, "");
  return digits ? Number(digits) : NaN;
};

const list = (v: string) =>
  v
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

function parseColors(value: string): Color[] {
  return list(value).map((entry) => {
    const hex = entry.match(/#[0-9a-f]{3,8}\b/i)?.[0];
    const name = entry.replace(/[:=]?\s*#[0-9a-f]{3,8}\b/i, "").trim();
    const known = namedColors[norm(name)];
    return { name: name || "Único", hex: hex ?? known?.hex ?? "#d9d4cc" };
  });
}

function parseSizes(value: string): Size[] {
  return list(value).map((entry) => {
    // "S:2", "M = 3" o "XL 1". Un número suelto ("38") es un talle con stock 1.
    const m = entry.match(/^(.+?)\s*[:=]\s*(\d+)$/) ?? entry.match(/^(\D.*?)\s+(\d+)$/);
    return m ? { label: m[1].trim(), stock: Number(m[2]) } : { label: entry, stock: 1 };
  });
}

/** Links de Google Drive ("compartir") a una URL de imagen directa. */
export function toImageUrl(raw: string) {
  const url = raw.trim();
  const driveId =
    url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)?.[1] ?? url.match(/drive\.google\.com\/.*[?&]id=([\w-]+)/)?.[1];
  return driveId ? `https://lh3.googleusercontent.com/d/${driveId}` : url;
}

/** Fecha de ingreso (dd/mm/aaaa o aaaa-mm-dd) a número de días, para ordenar "novedades". */
function parseDate(value: string) {
  const v = value.trim();
  let y: number, m: number, d: number;
  const iso = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  const local = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/);
  if (iso) [y, m, d] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
  else if (local) [d, m, y] = [Number(local[1]), Number(local[2]), Number(local[3])];
  else return null;
  if (y < 100) y += 2000;
  const time = Date.UTC(y, m - 1, d);
  return Number.isNaN(time) || m > 12 || d > 31 ? null : time / 86_400_000;
}

export function parseCatalogCsv(
  text: string,
  { seen = new Set<string>(), label = "Fila" }: { seen?: Set<string>; label?: string } = {},
): { products: Product[]; warnings: string[] } {
  const [header, ...rows] = parseCsv(text);
  const warnings: string[] = [];
  if (!header) return { products: [], warnings: ["La planilla está vacía"] };

  const headerNorm = header.map((h) => norm(h).replace(/_/g, " "));
  const col: Partial<Record<keyof typeof columnAliases, number>> = {};
  for (const [key, aliases] of Object.entries(columnAliases)) {
    const idx = headerNorm.findIndex((h) => aliases.some((a) => h === a.replace(/_/g, " ")));
    if (idx >= 0) col[key as keyof typeof columnAliases] = idx;
  }
  for (const required of ["name", "category", "price", "images"] as const) {
    if (col[required] === undefined) warnings.push(`Falta la columna "${columnAliases[required][0]}"`);
  }

  const products: Product[] = [];

  // Categoría de la pestaña: la más usada entre sus filas (para filas que la dejan vacía).
  const counts = new Map<CategoryId, number>();
  for (const row of rows) {
    const c = col.category === undefined ? null : parseCategory(row[col.category] ?? "");
    if (c) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  const tabCategory = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  rows.forEach((row, i) => {
    const line = i + 2;
    const get = (k: keyof typeof columnAliases) => (col[k] === undefined ? "" : (row[col[k]!] ?? "").trim());

    const active = norm(get("active"));
    if (["no", "falso", "false", "0", "oculto"].includes(active)) return;

    const name = get("name");
    if (!name) return;
    const category = get("category") ? parseCategory(get("category")) : tabCategory;
    const price = parseMoney(get("price"));
    const images = get("images")
      .split(/[\s|]+/)
      .map(toImageUrl)
      .filter((u) => /^https?:\/\//.test(u));

    const problems = [
      !category && `categoría "${get("category")}" no reconocida`,
      !(price > 0) && "precio inválido",
      images.length === 0 && "sin fotos (pegá al menos un link)",
    ].filter(Boolean);
    if (problems.length) {
      warnings.push(`${label} ${line} (${name}): ${problems.join(", ")}`);
      return;
    }

    let slug = slugify(get("slug") || name);
    if (seen.has(slug)) {
      warnings.push(`${label} ${line} (${name}): el slug "${slug}" ya existe; se publicó como "${slug}-${line}"`);
      slug = `${slug}-${line}`;
    }
    seen.add(slug);

    const compareAt = parseMoney(get("compareAt"));
    const badge = badgeAliases[norm(get("badge"))];
    const colors = parseColors(get("colors"));
    const sizes = parseSizes(get("sizes"));
    const description = get("description")
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const sold = parseMoney(get("sold"));

    products.push({
      slug,
      name: name.toLowerCase(),
      category: category!,
      collections: list(get("collections"))
        .map(norm)
        .filter((c): c is CollectionTag => collectionTags.includes(c as CollectionTag)),
      price,
      compareAt: compareAt > price ? compareAt : undefined,
      badge: badge ?? (compareAt > price ? "oferta" : undefined),
      material: get("material") || categories.find((c) => c.id === category)!.label,
      colors: colors.length ? colors : [{ name: "Único", hex: "#d9d4cc" }],
      sizes: sizes.length ? sizes : [{ label: "Único", stock: 1 }],
      images: images.map((src, n) => ({ src, alt: n === 0 ? name : `${name}, foto ${n + 1}` })),
      description: description.length ? description : [name],
      // Con fecha de ingreso se ordena por fecha; sin fecha, las primeras filas son las más nuevas.
      addedAt: parseDate(get("addedAt")) ?? (rows.length - i) / 1000,
      sold: Number.isFinite(sold) ? sold : 0,
    });
  });

  return { products, warnings };
}
