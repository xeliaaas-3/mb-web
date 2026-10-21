import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";
import { GiftCardPicker } from "./GiftCardPicker";

export const metadata: Metadata = {
  title: "Gift card",
  description: `Regalá ${site.name}: gift cards digitales o impresas, válidas por 6 meses en la tienda y el showroom.`,
  alternates: { canonical: "/gift-card" },
};

export default function GiftCardPage() {
  return (
    <>
      <PageHeader eyebrowText="Regalos" title={`gift card ${site.shortName.toLowerCase()}`}>
        El regalo que siempre acierta: quien la recibe elige su prenda y su talle. Válida por 6 meses en la tienda
        online y en el showroom.
      </PageHeader>
      <GiftCardPicker />
    </>
  );
}
