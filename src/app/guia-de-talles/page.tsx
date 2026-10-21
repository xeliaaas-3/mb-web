import type { Metadata } from "next";
import { Ruler } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SizeAssistant } from "@/components/SizeAssistant";
import { button, card } from "@/components/ui";
import { sizeChart } from "@/lib/sizes";

export const metadata: Metadata = {
  title: "Guía de talles",
  description: "Tabla de medidas en centímetros y cómo medirte para elegir tu talle.",
  alternates: { canonical: "/guia-de-talles" },
};

const howTo = [
  { title: "Busto", body: "Pasá la cinta por la parte más prominente del busto, sin ajustar." },
  { title: "Cintura", body: "Medí en la parte más angosta, por encima del ombligo." },
  { title: "Cadera", body: "Medí en la parte más ancha de la cadera, con los pies juntos." },
];

const shoes = [
  ["35", "22,5"],
  ["36", "23"],
  ["37", "23,5"],
  ["38", "24,5"],
  ["39", "25"],
  ["40", "25,5"],
];

const jeans = [
  ["36", "S", "66 - 70"],
  ["38", "M", "72 - 76"],
  ["40", "L", "78 - 84"],
  ["42", "XL", "86 - 92"],
];

function Table({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <div className={`overflow-x-auto p-5 ${card}`}>
      <table className="w-full text-left text-body-md">
        <caption className="mb-3 text-left font-serif text-headline-sm italic">{caption}</caption>
        <thead>
          <tr className="border-b border-hairline label-caps-sm text-stone-text">
            {head.map((h) => (
              <th key={h} scope="col" className="py-2 pr-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([first, ...rest]) => (
            <tr key={String(first)} className="border-b border-hairline last:border-0">
              <th scope="row" className="py-2.5 pr-4 font-medium">
                {first}
              </th>
              {rest.map((v, i) => (
                <td key={i} className="py-2.5 pr-4 text-stone-text">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <>
      <PageHeader eyebrowText="Ayuda" title="guía de talles">
        Todas las medidas son del cuerpo, en centímetros. Si estás entre dos talles, te recomendamos el más grande.
      </PageHeader>

      <div className="page-width grid gap-gutter-mobile page-x pb-section md:gap-gutter lg:grid-cols-2">
        <Table
          caption="ropa"
          head={["Talle", "Busto", "Cintura", "Cadera"]}
          rows={sizeChart.map((r) => [r.label, r.bust.join(" - "), r.waist.join(" - "), r.hip.join(" - ")])}
        />
        <div className="space-y-gutter-mobile md:space-y-gutter">
          <Table caption="jeans" head={["Talle", "Equivale", "Cintura"]} rows={jeans} />
          <Table caption="calzado" head={["Talle", "Largo del pie (cm)"]} rows={shoes} />
        </div>

        <section className="rounded-2xl bg-sand p-6 md:p-8 lg:col-span-2" aria-labelledby="como-medirte">
          <h2 id="como-medirte" className="font-serif text-headline-sm italic">
            cómo medirte
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {howTo.map((h) => (
              <li key={h.title}>
                <p className="label-caps-sm">{h.title}</p>
                <p className="mt-1 text-body-md text-stone-text">{h.body}</p>
              </li>
            ))}
          </ul>
          <SizeAssistant className={`${button.primary} mt-6`}>
            <Ruler size={14} strokeWidth={1.5} /> Calcular mi talle
          </SizeAssistant>
        </section>
      </div>
    </>
  );
}
