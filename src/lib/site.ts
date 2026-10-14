export const site = {
  name: "Maria Bonita Boutique",
  shortName: "Maria Bonita",
  tagline: "Boutique | PY",
  description:
    "Moda femenina de autor en lino, seda y algodón. Comprá online y coordiná tu pedido por WhatsApp. Envíos a todo Paraguay.",
  /** Número de WhatsApp en formato internacional, solo dígitos. */
  whatsapp: "595985200792",
  whatsappDisplay: "+595 985 200 792",
  instagram: "mabonitaaa",
  address: {
    street: "Las Residentas 1402",
    detail: "c/ Juan Leopardi",
    city: "Fernando de la Mora",
    mapsQuery: "Las Residentas 1402, Fernando de la Mora, Paraguay",
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
    detail: "Asunción, Fernando de la Mora y Gran Asunción (12 a 24 hs)",
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
