"use client";

import { useRef, useState, type ReactNode } from "react";
import { Ruler, X } from "lucide-react";
import { bustRange, recommendSize, sizeChart } from "@/lib/sizes";
import { whatsappLink } from "@/lib/site";

/** Asistente de talles: la clienta indica su busto y recibe un talle sugerido. */
export function SizeAssistant({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [bust, setBust] = useState(90);
  const result = recommendSize(bust);

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={className}>
        {children}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="asistente-titulo"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-card p-0 text-ink shadow-float open:animate-[fade-in_250ms]"
      >
        <div className="relative p-6 md:p-8">
          <button
            type="button"
            aria-label="Cerrar asistente"
            onClick={() => ref.current?.close()}
            className="absolute top-4 right-4 rounded-full p-1.5 text-stone-text hover:bg-sand hover:text-ink"
          >
            <X size={20} strokeWidth={1.25} />
          </button>
          <h2 id="asistente-titulo" className="flex items-center gap-2 font-serif text-headline-sm italic">
            <Ruler size={20} strokeWidth={1.25} /> asistente de talles
          </h2>
          <p className="mt-1 text-body-sm text-stone-text">
            Deslizá para indicar tu contorno de busto y te recomendamos el talle ideal.
          </p>

          <label className="mt-6 block">
            <span className="flex items-baseline justify-between text-body-md font-medium">
              Tu medida de busto
              <span className="font-serif text-headline-sm">{bust} cm</span>
            </span>
            <input
              type="range"
              min={bustRange.min}
              max={bustRange.max}
              value={bust}
              onChange={(e) => setBust(Number(e.target.value))}
              className="mt-3 w-full cursor-pointer accent-ink"
            />
          </label>
          <div className="mt-1 flex justify-between text-[10px] text-stone-text">
            <span>{bustRange.min} cm</span>
            <span>{bustRange.max} cm</span>
          </div>

          <div className="mt-6 rounded-2xl border border-hairline bg-sand p-5 text-center" aria-live="polite">
            <span className="block label-caps-sm text-stone-text">Talle recomendado</span>
            <span className="mt-1 block font-serif text-display-mobile">{result.size}</span>
            <p className="mt-1 text-body-sm text-stone-text">{result.note}</p>
          </div>

          <table className="mt-6 w-full text-left text-body-sm">
            <caption className="sr-only">Guía de medidas en centímetros</caption>
            <thead>
              <tr className="border-b border-hairline label-caps-sm text-stone-text">
                <th scope="col" className="py-2 font-semibold">
                  Talle
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Busto
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Cintura
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Cadera
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((r) => (
                <tr
                  key={r.size}
                  className={`border-b border-hairline last:border-0 ${result.size.split("o").includes(r.size) ? "font-semibold" : "text-stone-text"}`}
                >
                  <th scope="row" className="py-2 font-medium">
                    {r.label}
                  </th>
                  <td className="py-2">{r.bust.join(" - ")}</td>
                  <td className="py-2">{r.waist.join(" - ")}</td>
                  <td className="py-2">{r.hip.join(" - ")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <a
            href={whatsappLink(`¡Hola! Mido ${bust} cm de busto, ¿qué talle me recomiendan?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block text-center text-body-sm underline underline-offset-4 hover:text-bronze"
          >
            ¿Dudas? Consultá con una asesora por WhatsApp
          </a>
        </div>
      </dialog>
    </>
  );
}
