export const site = {
  /**
   * URL pública, sin barra final. Se puede pisar con NEXT_PUBLIC_SITE_URL.
   *
   * ⚠ EL VALOR DE RESERVA ES EL DOMINIO REAL, no una URL de preview. Las
   * variables NEXT_PUBLIC_* las incrusta Next AL COMPILAR: definirla en
   * tiempo de ejecución —por ejemplo como "var" del Worker— llega tarde y el
   * build ya usó la reserva. Pasó: el robots.txt y el sitemap se publicaron
   * apuntando a mb-web-drab.vercel.app. Con el dominio real acá, el peor caso
   * es el correcto aunque nadie defina la variable.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tienda.studioxcreative.digital").replace(/\/$/, ""),
  name: "Alba Boutique",
  shortName: "Alba",
  tagline: "Boutique | PY",
  description:
    "Moda femenina de autor en lino, seda y algodón. Comprá online y coordiná tu pedido por WhatsApp. Envíos a todo Paraguay.",
  /** Número de WhatsApp en formato internacional, solo dígitos. */
  whatsapp: "595981768247",
  whatsappDisplay: "+595 981 768 247",
  instagram: "albaboutique.py",
  /** Esta tienda es una demo de StudioX: aviso arriba de todo y crédito en el pie de página. */
  demo: { by: "StudioX", instagram: "studiox.py" },
  address: {
    street: "Av. España 1234",
    detail: "Villa Morra",
    city: "Asunción",
    mapsQuery: "Villa Morra, Asunción, Paraguay",
  },
  hours: "Lunes a sábado, 09:00 a 19:00 hs",
  parking: "Privado y gratuito",
  /** Días para cambios desde la entrega. */
  exchangeDays: 15,
  installments: 3,
} as const;

export type ShippingId = "delivery" | "pickup" | "interior";

export const shippingOptions: {
  id: ShippingId;
  label: string;
  detail: string;
  cost: number;
  needsAddress: boolean;
}[] = [
  {
    id: "delivery",
    label: "Delivery a domicilio",
    detail: "Asunción y Gran Asunción (12 a 24 hs)",
    cost: 25000,
    needsAddress: true,
  },
  {
    id: "pickup",
    label: "Retiro en boutique",
    detail: `${site.address.street}, ${site.address.city}`,
    cost: 0,
    needsAddress: false,
  },
  {
    id: "interior",
    label: "Interior del país",
    detail: "Transportadora AEX / NSA o encomienda a coordinar",
    cost: 30000,
    needsAddress: true,
  },
];

/** Desde este subtotal el delivery en Gran Asunción es gratis. */
export const freeDeliveryThreshold = 520000;

export const paymentMethods = [
  "Transferencia bancaria",
  "Efectivo contra entrega",
  "Billetera Tigo Money / Billetera Personal",
  "Tarjeta de débito o crédito (POS al recibir)",
] as const;

export function shippingCost(id: ShippingId, subtotal: number) {
  const option = shippingOptions.find((o) => o.id === id)!;
  if (id === "delivery" && subtotal >= freeDeliveryThreshold) return 0;
  return option.cost;
}

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Datos de cobro que ve la clienta después de enviar el pedido.
 * TODO: reemplazar por los datos reales del negocio (estos son de ejemplo).
 */
export const paymentDetails = {
  bank: [
    { label: "Banco", value: "Banco Ejemplo S.A." },
    { label: "Titular", value: "Alba Boutique S.A." },
    { label: "RUC", value: "80000000-0" },
    { label: "Cuenta corriente", value: "0000000000" },
    { label: "Alias", value: "0981000000" },
  ],
  wallet: { label: "Número de billetera", value: "0981 000 000" },
} as const;

export type PaymentKind = "transfer" | "wallet" | "on-delivery";

export function paymentKind(method: string): PaymentKind {
  if (method === paymentMethods[0]) return "transfer";
  if (method === paymentMethods[2]) return "wallet";
  return "on-delivery";
}
