"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronDown, Minus, Plus, RefreshCw, Send, ShieldCheck, Smile, Store, Trash2, Truck } from "lucide-react";
import { button, eyebrow } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { cart, useCart } from "@/lib/cart";
import { PaymentInstructions } from "./PaymentInstructions";
import { imageFor } from "@/lib/products";
import { formatGs } from "@/lib/format";
import {
  buildOrderMessage,
  newOrderId,
  orderTotals,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutForm,
} from "@/lib/order";
import { freeDeliveryThreshold, paymentMethods, shippingCost, shippingOptions, site, whatsappLink } from "@/lib/site";

const initialForm: CheckoutForm = {
  name: "",
  phone: "",
  shipping: "delivery",
  address: "",
  reference: "",
  payment: paymentMethods[0],
  notes: "",
};

const trust = [
  {
    Icon: Smile,
    title: "Atención personalizada",
    body: "Asesoramiento directo en styling y talles reales por WhatsApp.",
  },
  { Icon: RefreshCw, title: `Cambios hasta ${site.exchangeDays} días`, body: "En prendas sin uso y con etiqueta." },
  {
    Icon: Store,
    title: `Boutique en ${site.address.detail}, ${site.address.city}`,
    body: `${site.address.street} · ${site.hours}.`,
  },
];

const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

export function BagView() {
  const mounted = useMounted();
  const { items, count, subtotal } = useCart();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [sentOrder, setSentOrder] = useState<string | null>(null);

  const totals = orderTotals(subtotal, form.shipping);
  const option = shippingOptions.find((o) => o.id === form.shipping)!;
  const missingForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const previewId = sentOrder ?? "AB-XXXXX";

  const set = <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateCheckout(form, items);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`f-${firstInvalid}`)?.focus();
      return;
    }
    const id = newOrderId();
    window.open(whatsappLink(buildOrderMessage(id, form, items)), "_blank", "noopener,noreferrer");
    trackEvent("order_sent", {
      order: id,
      items: count,
      value: totals.total,
      payment: form.payment,
      shipping: form.shipping,
    });
    setSentOrder(id);
    window.scrollTo({ top: 0 });
  }

  if (!mounted) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (sentOrder) {
    return (
      <div className="mx-auto max-w-xl page-x py-section text-center">
        <p className={eyebrow}>Pedido {sentOrder}</p>
        <h1 className="mt-3 font-serif text-headline-lg-mobile lowercase italic md:text-headline-lg">
          ¡ya casi es tuyo!
        </h1>
        <p className="mt-4 text-body-lg text-stone-text">
          Abrimos WhatsApp con tu pedido armado. Enviá el mensaje y una asesora te confirma stock y envío.
        </p>
        <div className="mt-8">
          <PaymentInstructions method={form.payment} total={totals.total} orderId={sentOrder} />
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={whatsappLink(buildOrderMessage(sentOrder, form, items))}
            target="_blank"
            rel="noopener noreferrer"
            className={button.whatsapp}
          >
            <Send size={16} strokeWidth={1.25} />
            Volver a abrir WhatsApp
          </a>
          <button
            type="button"
            className={button.outline}
            onClick={() => {
              cart.clear();
              setSentOrder(null);
              setForm(initialForm);
            }}
          >
            Ya lo envié · vaciar bolsa
          </button>
          <button type="button" className="mx-auto mt-2 link-editorial label-caps" onClick={() => setSentOrder(null)}>
            Editar pedido
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl page-x py-section text-center">
        <h1 className="font-serif text-headline-lg-mobile lowercase italic md:text-headline-lg">tu bolsa está vacía</h1>
        <p className="mt-4 text-body-lg text-stone-text">
          Descubrí las piezas de la nueva colección y agregá tus favoritas.
        </p>
        <Link href="/catalogo" className={`${button.primary} mt-8`}>
          Ver colección
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="page-width page-x pt-6 pb-section md:pt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>{site.name} · PY</p>
          <h1 className="mt-2 font-serif text-headline-lg-mobile lowercase italic md:text-headline-lg">
            tu bolsa de compras
          </h1>
        </div>
        <p className="shrink-0 pb-1 text-body-sm whitespace-nowrap text-stone-text">
          ({count} {count === 1 ? "prenda" : "prendas"})
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-gutter">
        <div className="space-y-8 lg:col-span-7">
          {/* Envío gratis */}
          <div className="rounded-2xl border border-hairline bg-sand p-4">
            <p className="flex items-start gap-3 text-body-md">
              <Truck size={18} strokeWidth={1.25} className="mt-0.5 shrink-0" />
              {missingForFree > 0 ? (
                <span>
                  ¡Estás a solo <strong className="font-medium">{formatGs(missingForFree)}</strong> de obtener envío
                  gratis a Gran Asunción!
                </span>
              ) : (
                <span>
                  <strong className="font-medium">¡Tenés envío gratis</strong> a Gran Asunción!
                </span>
              )}
            </p>
            <div
              className="mt-3 h-1 overflow-hidden rounded-full bg-sand-deep"
              role="progressbar"
              aria-label="Progreso hacia el envío gratis"
              aria-valuemin={0}
              aria-valuemax={freeDeliveryThreshold}
              aria-valuenow={Math.min(subtotal, freeDeliveryThreshold)}
            >
              <div
                className="h-full bg-ink transition-[width] duration-700"
                style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-body-sm text-stone-text">
              <span>Acumulado: {formatGs(subtotal)}</span>
              <span>Meta: {formatGs(freeDeliveryThreshold)}</span>
            </div>
          </div>

          {/* Prendas */}
          <ul className="space-y-3" aria-label="Prendas en tu bolsa">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 rounded-2xl border border-hairline bg-card p-3 shadow-soft">
                <Link
                  href={`/prenda/${item.slug}`}
                  className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-sand md:w-28"
                >
                  <Image
                    src={imageFor(item.product, item.color).src}
                    alt={imageFor(item.product, item.color).alt}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/prenda/${item.slug}`} className="font-serif text-title lowercase">
                      {item.product.name}
                    </Link>
                    <button
                      type="button"
                      aria-label={`Quitar ${item.product.name}`}
                      onClick={() => cart.remove(item.key)}
                      className="-mt-1 -mr-1 p-1 text-stone-text hover:text-ink"
                    >
                      <Trash2 size={16} strokeWidth={1.25} />
                    </button>
                  </div>
                  <p className="mt-1 label-caps-sm text-stone-text">
                    Talle {item.size} · {item.color}
                  </p>
                  {item.maxQty === 0 && <p className="mt-1 text-body-sm text-error">Sin stock en este talle.</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-hairline bg-card">
                      <button
                        type="button"
                        aria-label="Restar una unidad"
                        disabled={item.qty <= 1}
                        onClick={() => cart.setQty(item.key, item.qty - 1)}
                        className="flex size-9 items-center justify-center disabled:text-stone"
                      >
                        <Minus size={14} strokeWidth={1.25} />
                      </button>
                      <span className="w-8 text-center text-body-md" aria-live="polite">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Sumar una unidad"
                        disabled={item.qty >= item.maxQty}
                        onClick={() => cart.setQty(item.key, item.qty + 1)}
                        className="flex size-9 items-center justify-center disabled:text-stone"
                      >
                        <Plus size={14} strokeWidth={1.25} />
                      </button>
                    </div>
                    <p className="text-price">{formatGs(item.lineTotal)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {errors.items && (
            <p role="alert" className="text-body-sm text-error">
              {errors.items}
            </p>
          )}

          {/* Datos */}
          <section className="rounded-2xl bg-sand p-5 md:p-8" aria-labelledby="datos-entrega">
            <div className="flex items-start justify-between">
              <div>
                <p className={eyebrow}>Paso final</p>
                <h2 id="datos-entrega" className="mt-1 font-serif text-headline-sm lowercase italic">
                  datos para tu entrega
                </h2>
              </div>
              <ShieldCheck size={20} strokeWidth={1.25} />
            </div>
            <p className="mt-2 text-body-md text-stone-text">
              Completá tus datos para generar tu pedido directo al WhatsApp de nuestras asesoras.
            </p>

            <div className="mt-6 space-y-6">
              <Field id="name" label="Nombre y apellido *" error={errors.name}>
                <input
                  id="f-name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "e-name" : undefined}
                  className={inputClass}
                />
              </Field>
              <Field id="phone" label="Número de WhatsApp (Paraguay) *" error={errors.phone}>
                <input
                  id="f-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0981 123 456"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "e-phone" : undefined}
                  className={inputClass}
                />
              </Field>

              <fieldset>
                <legend className="label-caps-sm">Modalidad de entrega</legend>
                <div className="mt-3 space-y-2">
                  {shippingOptions.map((o) => {
                    const cost = shippingCost(o.id, subtotal);
                    return (
                      <label
                        key={o.id}
                        className={`flex cursor-pointer gap-3 rounded-xl border bg-card p-4 transition-colors ${
                          form.shipping === o.id ? "border-ink" : "border-hairline hover:border-stone"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={o.id}
                          checked={form.shipping === o.id}
                          onChange={() => set("shipping", o.id)}
                          className="mt-1 accent-ink"
                        />
                        <span className="flex-1">
                          <span className="flex justify-between gap-2 text-body-md font-medium">
                            {o.label}
                            <span className={cost === 0 ? "self-center label-caps-sm" : "text-price"}>
                              {cost === 0 ? "Gratis" : `+${formatGs(cost)}`}
                            </span>
                          </span>
                          <span className="mt-1 block text-body-sm text-stone-text">{o.detail}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {option.needsAddress && (
                <>
                  <Field id="address" label="Dirección exacta, barrio y ciudad *" error={errors.address}>
                    <input
                      id="f-address"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? "e-address" : undefined}
                      className={inputClass}
                    />
                  </Field>
                  <Field id="reference" label="Referencia para el repartidor">
                    <input
                      id="f-reference"
                      placeholder="Casa portón negro al lado del súper"
                      value={form.reference}
                      onChange={(e) => set("reference", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </>
              )}

              <fieldset>
                <legend className="label-caps-sm">Método de pago preferido</legend>
                <div className="mt-3 space-y-2">
                  {paymentMethods.map((m) => (
                    <label
                      key={m}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-3 text-body-md transition-colors ${
                        form.payment === m ? "border-ink" : "border-hairline hover:border-stone"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m}
                        checked={form.payment === m}
                        onChange={() => set("payment", m)}
                        className="accent-ink"
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field id="notes" label="Notas o dedicatoria para regalo">
                <textarea
                  id="f-notes"
                  rows={3}
                  placeholder="¿Es un regalo? Añadí una dedicatoria o indicación especial…"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  className={`${inputClass} h-auto resize-y py-3`}
                />
              </Field>
            </div>
          </section>
        </div>

        {/* Resumen */}
        <aside className="lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-28">
            <dl className="rounded-2xl border border-hairline bg-card p-5 text-body-md shadow-soft md:p-6">
              <div className="flex justify-between py-1">
                <dt className="text-stone-text">Subtotal prendas ({count})</dt>
                <dd>{formatGs(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-stone-text">Envío ({option.label.toLowerCase()})</dt>
                <dd>{totals.shipping === 0 ? "Gratis" : formatGs(totals.shipping)}</dd>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-hairline pt-4">
                <dt className="font-serif text-title italic">total a pagar</dt>
                <dd className="font-serif text-headline-md">{formatGs(totals.total)}</dd>
              </div>
            </dl>

            <div>
              <button type="submit" className={`${button.primary} h-14 w-full`}>
                <Send size={16} strokeWidth={1.25} />
                Enviar pedido por WhatsApp ({formatGs(totals.total)})
              </button>
              <p className="mt-3 text-center text-body-sm text-stone-text">
                Se abrirá WhatsApp con tu pedido listo para confirmar con {site.whatsappDisplay}.
              </p>
            </div>

            <details className="group overflow-hidden rounded-2xl border border-hairline bg-sand">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 label-caps-sm [&::-webkit-details-marker]:hidden">
                Ver mensaje que enviaremos
                <ChevronDown size={16} strokeWidth={1.25} className="transition-transform group-open:rotate-180" />
              </summary>
              <pre className="mx-5 mb-5 rounded-xl bg-card p-4 font-sans text-body-sm whitespace-pre-wrap text-stone-text">
                {buildOrderMessage(previewId, form, items)}
              </pre>
            </details>

            <ul className="space-y-4 rounded-2xl border border-hairline bg-card p-5 text-body-sm shadow-soft">
              {trust.map(({ Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <Icon size={18} strokeWidth={1.25} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block label-caps-sm">{title}</span>
                    <span className="text-stone-text">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </form>
  );
}

const inputClass =
  "h-12 w-full rounded-lg border border-hairline bg-card px-4 text-body-md outline-none transition-[border-color,box-shadow] placeholder:text-stone-text/70 focus:border-ink focus:shadow-[0_0_0_1px_var(--color-ink)] aria-invalid:border-error";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="block label-caps-sm">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`e-${id}`} role="alert" className="mt-1.5 text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
