import type { ResolvedLine } from "./cart";
import { formatGs } from "./format";
import { shippingCost, shippingOptions, site, type ShippingId } from "./site";

export type CheckoutForm = {
  name: string;
  phone: string;
  shipping: ShippingId;
  address: string;
  reference: string;
  payment: string;
  notes: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutForm | "items", string>>;

/** Acepta 09XX XXX XXX, 9XX XXX XXX o +595 9XX XXX XXX. */
export function normalizeParaguayPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("595") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;
  return /^9\d{8}$/.test(local) ? `+595 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}` : null;
}

export function validateCheckout(form: CheckoutForm, items: ResolvedLine[]): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const option = shippingOptions.find((o) => o.id === form.shipping)!;
  if (items.length === 0) errors.items = "Tu bolsa está vacía.";
  if (items.some((i) => i.maxQty === 0)) errors.items = "Hay prendas sin stock en tu bolsa. Quitalas para continuar.";
  if (form.name.trim().length < 3) errors.name = "Ingresá tu nombre y apellido.";
  if (!normalizeParaguayPhone(form.phone))
    errors.phone = "Ingresá un celular paraguayo válido, por ejemplo 0981 123 456.";
  if (option.needsAddress && form.address.trim().length < 6) errors.address = "Ingresá la dirección, barrio y ciudad.";
  if (!form.payment) errors.payment = "Elegí un método de pago.";
  return errors;
}

export function orderTotals(subtotal: number, shipping: ShippingId) {
  const ship = shippingCost(shipping, subtotal);
  return { subtotal, shipping: ship, total: subtotal + ship };
}

export function newOrderId() {
  const n = Math.floor(Date.now() / 1000) % 100000;
  return `AB-${String(n).padStart(5, "0")}`;
}

/** Texto plano del pedido. Se codifica una sola vez al armar el link de WhatsApp. */
export function buildOrderMessage(orderId: string, form: CheckoutForm, items: ResolvedLine[]) {
  const option = shippingOptions.find((o) => o.id === form.shipping)!;
  const subtotal = items.reduce((n, i) => n + i.lineTotal, 0);
  const totals = orderTotals(subtotal, form.shipping);
  const rule = "──────────────";

  const lines = [
    ...(site.demo ? [`(Pedido de prueba desde la demo de ${site.demo.by})`, ""] : []),
    `¡Hola! Quiero confirmar este pedido hecho desde la web de ${site.name}.`,
    "",
    `*Pedido ${orderId}*`,
    rule,
    ...items.map(
      (i) => `• ${i.qty} × ${capitalize(i.product.name)} (talle ${i.size}, ${i.color}) — ${formatGs(i.lineTotal)}`,
    ),
    rule,
    `Subtotal: ${formatGs(totals.subtotal)}`,
    `Envío (${option.label}): ${totals.shipping === 0 ? "gratis" : formatGs(totals.shipping)}`,
    `*Total: ${formatGs(totals.total)}*`,
    `Pago: ${form.payment}`,
    rule,
    `Nombre: ${form.name.trim()}`,
    `Celular: ${normalizeParaguayPhone(form.phone) ?? form.phone.trim()}`,
  ];

  if (option.needsAddress) {
    lines.push(`Dirección: ${form.address.trim()}`);
    if (form.reference.trim()) lines.push(`Referencia: ${form.reference.trim()}`);
  } else {
    lines.push("Retiro en boutique");
  }
  if (form.notes.trim()) lines.push(`Notas: ${form.notes.trim()}`);

  return lines.join("\n");
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
