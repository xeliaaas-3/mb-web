/** Clases de botones según DESIGN.md: 48px de alto, radio 0, label-caps. */
const base =
  "label-caps inline-flex h-12 items-center justify-center gap-3 px-6 transition-colors duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-40";

export const button = {
  primary: `${base} bg-ink text-white hover:bg-bronze`,
  outline: `${base} border border-ink bg-white text-ink hover:bg-sand`,
  /** Sobre fotos oscuras (hero). */
  light: `${base} bg-white text-ink hover:bg-sand`,
  ghostLight: `${base} border border-white text-white hover:bg-white/10`,
  whatsapp: `${base} bg-whatsapp text-white hover:bg-ink`,
  whatsappOutline: `${base} border border-ink bg-white text-ink hover:bg-sand`,
};

export const sectionTitle = "font-serif text-headline-lg-mobile lowercase md:text-headline-lg";
export const eyebrow = "label-caps-sm text-stone-text";
