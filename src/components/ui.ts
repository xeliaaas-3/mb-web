/** Botones: 48px de alto, esquinas redondeadas, label-caps. */
const base =
  "label-caps inline-flex h-12 items-center justify-center gap-2.5 rounded-lg px-6 transition-[background-color,border-color,transform] duration-300 ease-editorial active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

export const button = {
  primary: `${base} bg-ink text-white hover:bg-bronze`,
  outline: `${base} border border-ink bg-card text-ink hover:bg-sand`,
  /** Sobre fotos oscuras (hero). */
  light: `${base} bg-white text-ink hover:bg-sand`,
  ghostLight: `${base} bg-white/10 text-white backdrop-blur-md hover:bg-white/20`,
  whatsapp: `${base} bg-whatsapp text-white hover:bg-ink`,
  whatsappOutline: `${base} border border-ink bg-card text-ink hover:bg-sand`,
};

/** Tarjeta blanca sobre el fondo crema. */
export const card = "rounded-2xl border border-hairline bg-card shadow-soft";

export const sectionTitle = "font-serif text-headline-lg-mobile lowercase italic md:text-headline-lg";
export const eyebrow = "label-caps-sm text-stone-text";
