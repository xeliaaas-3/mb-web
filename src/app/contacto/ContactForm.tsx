"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { button, card } from "@/components/ui";
import { whatsappLink } from "@/lib/site";

const topics = ["Consulta sobre una prenda", "Talles", "Estado de mi pedido", "Cambios", "Agendar visita", "Otro"];

const input =
  "h-12 w-full rounded-lg border border-hairline bg-card px-4 text-body-md outline-none transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_0_0_1px_var(--color-ink)]";

/** Formulario de contacto: arma el mensaje y lo abre en WhatsApp (no guarda datos). */
export function ContactForm() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");

  const text = `¡Hola! Soy ${name.trim() || "una clienta"}.\nTema: ${topic}\n${message.trim()}`;

  return (
    <form
      className={`space-y-4 p-5 md:p-6 ${card}`}
      onSubmit={(e) => {
        e.preventDefault();
        window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
      }}
    >
      <h2 className="font-serif text-headline-sm italic">escribinos</h2>
      <label className="block">
        <span className="label-caps-sm">Nombre</span>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={`${input} mt-2`} />
      </label>
      <label className="block">
        <span className="label-caps-sm">Tema</span>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={`${input} mt-2`}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="label-caps-sm">Mensaje</span>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${input} mt-2 h-auto resize-y py-3`}
        />
      </label>
      <button type="submit" className={`${button.primary} w-full`}>
        <Send size={16} strokeWidth={1.25} /> Enviar por WhatsApp
      </button>
    </form>
  );
}
