import { categories } from "@/lib/products";

/** Links principales del header en desktop. */
export const navLinks = [
  { href: "/catalogo?coleccion=nuevos", label: "Nuevos" },
  { href: "/catalogo?grupo=ropa", label: "Ropa" },
  { href: "/catalogo?grupo=accesorios", label: "Accesorios" },
  { href: "/catalogo?coleccion=sale", label: "Sale" },
  { href: "/lookbook", label: "Lookbook" },
] as const;

/** Menú completo (móvil) y footer. */
export const menuSections = [
  {
    title: "Comprar",
    links: [
      { href: "/catalogo?coleccion=nuevos", label: "Nuevos ingresos" },
      { href: "/catalogo?orden=mas-vendidos", label: "Más vendidos" },
      { href: "/catalogo", label: "Toda la colección" },
      { href: "/catalogo?coleccion=sale", label: "Sale" },
      { href: "/gift-card", label: "Gift card" },
    ],
  },
  {
    title: "Ropa",
    links: categories
      .filter((c) => c.group === "ropa")
      .map((c) => ({ href: `/catalogo?categoria=${c.id}`, label: c.label })),
  },
  {
    title: "Accesorios",
    links: categories
      .filter((c) => c.group === "accesorios")
      .map((c) => ({ href: `/catalogo?categoria=${c.id}`, label: c.label })),
  },
  {
    title: "Inspiración",
    links: [
      { href: "/lookbook", label: "Lookbook" },
      { href: "/nosotras", label: "Nosotras" },
      { href: "/favoritos", label: "Mis favoritos" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/guia-de-talles", label: "Guía de talles" },
      { href: "/envios-y-cambios", label: "Envíos y cambios" },
      { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];
