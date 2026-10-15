import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FavoritesGrid } from "./FavoritesGrid";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <>
      <PageHeader eyebrowText="Tu selección" title="favoritos">
        Las prendas que guardaste con el corazón. Se guardan en este dispositivo.
      </PageHeader>
      <FavoritesGrid />
    </>
  );
}
