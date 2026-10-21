"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { card } from "@/components/ui";
import { formatGs } from "@/lib/format";
import { paymentDetails, paymentKind, site } from "@/lib/site";

/** Cómo pagar, según el método elegido. Se muestra después de enviar el pedido. */
export function PaymentInstructions({ method, total, orderId }: { method: string; total: number; orderId: string }) {
  const kind = paymentKind(method);

  if (kind === "on-delivery") {
    return (
      <div className={`p-5 text-left ${card}`}>
        <p className="label-caps-sm text-stone-text">Cómo pagar</p>
        <p className="mt-2 text-body-md">
          Pagás al recibir con <strong className="font-medium">{method.toLowerCase()}</strong>. Tené listo{" "}
          <strong className="font-medium">{formatGs(total)}</strong>.
        </p>
      </div>
    );
  }

  const rows =
    kind === "transfer"
      ? [...paymentDetails.bank, { label: "Concepto", value: `Pedido ${orderId}` }]
      : [paymentDetails.wallet, { label: "Concepto", value: `Pedido ${orderId}` }];

  return (
    <div className={`p-5 text-left ${card}`}>
      <p className="label-caps-sm text-stone-text">Cómo pagar · {method}</p>
      <div className="mt-3 flex items-baseline justify-between border-b border-hairline pb-3">
        <span className="text-body-md">Monto a pagar</span>
        <CopyValue value={String(total)} display={formatGs(total)} large />
      </div>
      <dl className="divide-y divide-hairline">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-body-sm text-stone-text">{r.label}</dt>
            <dd>
              <CopyValue value={r.value} />
            </dd>
          </div>
        ))}
      </dl>
      {site.demo && (
        <p className="mt-3 text-body-sm text-stone-text">Datos de pago de ejemplo: esta tienda es una demo.</p>
      )}
      <p className="mt-3 rounded-xl bg-sand px-4 py-3 text-body-sm">
        Cuando pagues, enviá el comprobante por WhatsApp al {site.whatsappDisplay} y te confirmamos el envío.
      </p>
    </div>
  );
}

function CopyValue({ value, display, large }: { value: string; display?: string; large?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Sin permiso de portapapeles: el dato igual queda visible para copiarlo a mano.
        }
      }}
      aria-label={`Copiar ${display ?? value}`}
      className={`inline-flex items-center gap-2 text-right hover:text-bronze ${large ? "font-serif text-headline-sm" : "text-body-md font-medium"}`}
    >
      {display ?? value}
      {copied ? (
        <Check size={14} strokeWidth={1.75} className="text-success" />
      ) : (
        <Copy size={14} strokeWidth={1.5} className="text-stone-text" />
      )}
    </button>
  );
}
