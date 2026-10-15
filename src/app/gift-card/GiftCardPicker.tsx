"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { button, card } from "@/components/ui";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { giftCardAmounts } from "@/lib/content";
import { formatGs } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

const formats = ["Digital (te la enviamos por WhatsApp)", "Impresa (retiro en el showroom)"];

const input =
  "h-12 w-full rounded-lg border border-hairline bg-card px-4 text-body-md outline-none transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_0_0_1px_var(--color-ink)]";

export function GiftCardPicker() {
  const [amount, setAmount] = useState(giftCardAmounts[1]);
  const [format, setFormat] = useState(formats[0]);
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");

  const message = [
    "¡Hola! Quiero comprar una gift card.",
    `Monto: ${formatGs(amount)}`,
    `Formato: ${format}`,
    to.trim() && `Para: ${to.trim()}`,
    note.trim() && `Dedicatoria: ${note.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="page-width grid gap-8 page-x pb-section lg:grid-cols-2 lg:gap-gutter">
      {/* Vista previa */}
      <div className="flex aspect-[1.6] flex-col justify-between rounded-3xl bg-ink p-8 text-white shadow-float md:p-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-serif text-[28px] font-semibold tracking-[0.22em] uppercase">{site.shortName}</p>
            <p className="text-[10px] tracking-[0.28em] text-white/60 uppercase">Boutique | PY</p>
          </div>
          <Gift size={28} strokeWidth={1} className="text-white/70" />
        </div>
        <div>
          {to.trim() && <p className="font-serif text-title text-white/80 italic">para {to.trim()}</p>}
          <p className="font-serif text-display-mobile md:text-display">{formatGs(amount)}</p>
          <p className="label-caps-sm text-white/60">Gift card · válida 6 meses</p>
        </div>
      </div>

      <div className={`space-y-6 p-6 md:p-8 ${card}`}>
        <fieldset>
          <legend className="label-caps-sm">Monto</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {giftCardAmounts.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={amount === a}
                onClick={() => setAmount(a)}
                className={`h-12 rounded-lg border text-body-md font-medium transition-colors ${
                  amount === a ? "border-ink bg-ink text-white" : "border-hairline bg-card hover:border-ink"
                }`}
              >
                {formatGs(a)}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label-caps-sm">Formato</legend>
          <div className="mt-3 space-y-2">
            {formats.map((f) => (
              <label
                key={f}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-body-md ${
                  format === f ? "border-ink" : "border-hairline"
                }`}
              >
                <input
                  type="radio"
                  name="formato"
                  checked={format === f}
                  onChange={() => setFormat(f)}
                  className="accent-ink"
                />
                {f}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="label-caps-sm">¿Para quién es?</span>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Nombre" className={`${input} mt-2`} />
        </label>
        <label className="block">
          <span className="label-caps-sm">Dedicatoria (opcional)</span>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${input} mt-2 h-auto resize-y py-3`}
          />
        </label>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${button.primary} w-full`}
        >
          <WhatsAppIcon /> Pedir gift card por WhatsApp
        </a>
        <p className="text-body-sm text-stone-text">
          Coordinamos el pago por WhatsApp y te enviamos la gift card con un código único.
        </p>
      </div>
    </div>
  );
}
