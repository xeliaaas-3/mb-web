import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "./CatalogView";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Vestidos, conjuntos, blusas y accesorios de autor en lino, seda y algodón. Envíos a todo Paraguay.",
};

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogView />
    </Suspense>
  );
}
