import { img } from "./images";

export type CategoryId = "vestidos" | "conjuntos" | "blusas" | "pantalones" | "sastreria" | "accesorios";
export type CollectionId = "lino" | "gala" | "sets" | "seda" | "limitada";

export type Color = { name: string; hex: string };
export type Size = { label: string; stock: number };
export type Badge = "nuevo" | "mas-vendido" | "ultimas" | "edicion-especial" | "oferta";

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  collections: CollectionId[];
  price: number;
  compareAt?: number;
  badge?: Badge;
  material: string;
  colors: Color[];
  sizes: Size[];
  /** `color` opcional: la imagen que muestra ese tono (se usa en la bolsa). */
  images: { src: string; alt: string; color?: string }[];
  description: string[];
  /** Orden de "novedades": mayor = más reciente. */
  addedAt: number;
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: "vestidos", label: "Vestidos" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "blusas", label: "Blusas & Tops" },
  { id: "pantalones", label: "Pantalones" },
  { id: "sastreria", label: "Sastrería" },
  { id: "accesorios", label: "Accesorios" },
];

export const collections: { id: CollectionId; label: string; image: string; alt: string }[] = [
  { id: "lino", label: "Lino puro", image: img.colLino, alt: "Chaleco y pantalón de lino marfil" },
  { id: "gala", label: "Gala & cóctel", image: img.colGala, alt: "Vestido de gala drapeado" },
  { id: "sets", label: "Conjuntos & sets", image: img.colConjuntos, alt: "Conjunto de blazer y pantalón de lino" },
  { id: "seda", label: "Blusas & seda", image: img.colBlusas, alt: "Top de seda con escote asimétrico" },
  { id: "limitada", label: "Edición limitada", image: img.colLimitada, alt: "Vestido artesanal de edición limitada" },
];

export const badgeLabel: Record<Badge, string> = {
  nuevo: "Nuevo",
  "mas-vendido": "Más vendido",
  ultimas: "Últimas unidades",
  "edicion-especial": "Edición especial",
  oferta: "Oferta",
};

const C = {
  crudo: { name: "Crudo", hex: "#EDE6DA" },
  natural: { name: "Natural", hex: "#F3EEE4" },
  negro: { name: "Negro", hex: "#111111" },
  terracota: { name: "Terracota", hex: "#A65A3A" },
  oliva: { name: "Oliva", hex: "#5E6243" },
  arena: { name: "Arena", hex: "#D9C7AE" },
  carmin: { name: "Carmín", hex: "#8E1F2B" },
  marfil: { name: "Marfil", hex: "#F1EBDF" },
  camel: { name: "Camel", hex: "#A5703F" },
} satisfies Record<string, Color>;

const sizes = (entries: [string, number][]): Size[] => entries.map(([label, stock]) => ({ label, stock }));

export const products: Product[] = [
  {
    slug: "vestido-florencia-lino-crudo",
    name: "vestido florencia lino crudo",
    category: "vestidos",
    collections: ["lino"],
    price: 280000,
    badge: "nuevo",
    material: "Lino 100% natural",
    colors: [C.crudo, C.negro, C.terracota],
    sizes: sizes([
      ["S", 1],
      ["M", 1],
      ["L", 1],
      ["XL", 0],
    ]),
    images: [
      { src: img.florencia1, alt: "Modelo con el vestido Florencia de lino crudo, vista frontal" },
      { src: img.florencia2, alt: "Detalle de la textura del lino crudo" },
      { src: img.florencia3, alt: "Vestido Florencia, vista de espalda" },
    ],
    description: [
      "El vestido Florencia es una oda a la frescura y la sastrería natural. Confeccionado en lino europeo prelavado, con textura suave al tacto y sin encogimiento posterior.",
      "Corte evasé relajado, escote cuadrado sutil y forrería interior liviana 100% algodón: opacidad total y máxima respirabilidad para el clima cálido.",
    ],
    addedAt: 20,
  },
  {
    slug: "vestido-midi-santorini",
    name: "vestido midi santorini",
    category: "vestidos",
    collections: ["lino"],
    price: 290000,
    badge: "nuevo",
    material: "Lino y algodón",
    colors: [C.natural, C.negro, C.arena],
    sizes: sizes([
      ["S", 2],
      ["M", 3],
      ["L", 1],
    ]),
    images: [{ src: img.santorini, alt: "Vestido midi Santorini de lino marfil con volados escalonados" }],
    description: [
      "Midi de volados escalonados en lino marfil, pensado para tardes largas de verano. Breteles finos regulables y caída liviana.",
    ],
    addedAt: 19,
  },
  {
    slug: "conjunto-santina-terracota",
    name: "conjunto santina terracota",
    category: "conjuntos",
    collections: ["sets", "lino"],
    price: 320000,
    material: "Lino",
    colors: [C.terracota],
    sizes: sizes([
      ["S", 2],
      ["M", 2],
    ]),
    images: [{ src: img.santina, alt: "Conjunto Santina de chaleco y pantalón palazzo terracota" }],
    description: ["Chaleco sastre y pantalón palazzo al tono. Se usan juntos o por separado."],
    addedAt: 18,
  },
  {
    slug: "blusa-seda-pura-carmin",
    name: "blusa seda pura carmín",
    category: "blusas",
    collections: ["seda"],
    price: 190000,
    material: "Seda",
    colors: [C.carmin],
    sizes: sizes([
      ["M", 2],
      ["L", 1],
    ]),
    images: [{ src: img.blusaCarmin, alt: "Blusa de seda carmín sin mangas con cuello drapeado" }],
    description: ["Blusa sin mangas con cuello volcado, en seda de caída fluida. Del día a la noche."],
    addedAt: 17,
  },
  {
    slug: "maxi-dress-olimpia-oliva",
    name: "maxi dress olimpia oliva",
    category: "vestidos",
    collections: ["limitada"],
    price: 310000,
    material: "Viscosa estampada",
    colors: [C.oliva],
    sizes: sizes([
      ["S", 1],
      ["M", 2],
    ]),
    images: [{ src: img.olimpia, alt: "Maxi vestido Olimpia verde oliva con estampa botánica y escote halter" }],
    description: ["Maxi vestido con escote halter y estampa botánica en tonos oliva."],
    addedAt: 16,
  },
  {
    slug: "camisa-oversize-lino",
    name: "camisa oversize lino",
    category: "blusas",
    collections: ["lino"],
    price: 210000,
    badge: "mas-vendido",
    material: "Lino",
    colors: [C.oliva, C.natural],
    sizes: sizes([
      ["S", 3],
      ["M", 4],
      ["L", 2],
    ]),
    images: [{ src: img.camisaLino, alt: "Camisa oversize de lino verde oliva" }],
    description: ["Camisa amplia de lino lavado, mangas para arremangar. Un básico que se lleva con todo."],
    addedAt: 15,
  },
  {
    slug: "pantalon-palazzo-arena",
    name: "pantalón palazzo arena",
    category: "pantalones",
    collections: ["lino"],
    price: 240000,
    badge: "ultimas",
    material: "Lino",
    colors: [C.arena, C.negro],
    sizes: sizes([
      ["S", 1],
      ["M", 0],
      ["L", 1],
    ]),
    images: [{ src: img.palazzo, alt: "Pantalón palazzo de pierna ancha color arena" }],
    description: ["Tiro alto, pierna ancha y cintura con elástico posterior. Caída amplia y fresca."],
    addedAt: 14,
  },
  {
    slug: "vestido-gala-verona",
    name: "vestido gala verona",
    category: "vestidos",
    collections: ["gala"],
    price: 380000,
    badge: "edicion-especial",
    material: "Satén",
    colors: [C.terracota, C.negro],
    sizes: sizes([
      ["S", 1],
      ["M", 1],
      ["L", 1],
    ]),
    images: [{ src: img.verona, alt: "Vestido de gala Verona de satén terracota" }],
    description: ["Vestido largo de satén con breteles finos y corte al bies. Para fiestas y ceremonias."],
    addedAt: 13,
  },
  {
    slug: "top-escote-halter-seda",
    name: "top escote halter seda",
    category: "blusas",
    collections: ["seda"],
    price: 160000,
    material: "Seda de morera",
    colors: [C.natural, C.negro],
    sizes: sizes([
      ["S", 2],
      ["M", 2],
      ["L", 1],
    ]),
    images: [
      { src: img.halterNatural, alt: "Top halter de seda natural", color: "Natural" },
      { src: img.halterNegro, alt: "Top halter de seda negro", color: "Negro" },
    ],
    description: ["Top con escote halter y espalda descubierta, en seda de morera."],
    addedAt: 12,
  },
  {
    slug: "conjunto-siena",
    name: "conjunto siena",
    category: "conjuntos",
    collections: ["sets"],
    price: 340000,
    compareAt: 390000,
    badge: "oferta",
    material: "Algodón crudo",
    colors: [C.terracota, C.negro],
    sizes: sizes([
      ["S", 1],
      ["M", 2],
      ["L", 1],
    ]),
    images: [{ src: img.siena, alt: "Conjunto Siena de top y falda cruzada en algodón terracota" }],
    description: ["Top de manga corta y falda cruzada al tono, en algodón crudo."],
    addedAt: 11,
  },
  {
    slug: "blazer-sastre-lino-marfil",
    name: "blazer sastre lino marfil",
    category: "sastreria",
    collections: ["lino", "sets"],
    price: 340000,
    material: "Lino",
    colors: [C.marfil],
    sizes: sizes([
      ["S", 2],
      ["M", 2],
      ["L", 1],
    ]),
    images: [{ src: img.blazerMarfil, alt: "Blazer sastre de lino marfil" }],
    description: [
      "Corte desestructurado para elevar cualquier look. Versatilidad para jornadas de oficina y cenas al aire libre.",
    ],
    addedAt: 10,
  },
  {
    slug: "tote-bag-artesanal-cuero",
    name: "tote bag artesanal cuero",
    category: "accesorios",
    collections: [],
    price: 340000,
    material: "Cuero vacuno",
    colors: [C.camel],
    sizes: sizes([["Único", 3]]),
    images: [{ src: img.tote, alt: "Tote bag artesanal de cuero camel" }],
    description: ["Tote de cuero hecha a mano, con interior de lona y espacio para el día completo."],
    addedAt: 9,
  },
  {
    slug: "sandalias-palma-cuero",
    name: "sandalias palma cuero",
    category: "accesorios",
    collections: [],
    price: 210000,
    material: "Cuero trenzado",
    colors: [C.camel],
    sizes: sizes([
      ["36", 1],
      ["37", 2],
      ["38", 2],
      ["39", 1],
    ]),
    images: [{ src: img.sandalias, alt: "Sandalias planas de cuero trenzado" }],
    description: ["Sandalias planas con tiras de cuero trenzado a mano. Plantilla acolchada."],
    addedAt: 8,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function inStock(p: Product) {
  return p.sizes.some((s) => s.stock > 0);
}

export function totalStock(p: Product) {
  return p.sizes.reduce((n, s) => n + s.stock, 0);
}

export function imageFor(p: Product, color: string) {
  return p.images.find((i) => i.color === color) ?? p.images[0];
}
