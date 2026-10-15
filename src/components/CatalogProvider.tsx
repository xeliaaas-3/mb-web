"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Product } from "@/lib/products";

const CatalogContext = createContext<Product[]>([]);

/** Hace llegar el catálogo (leído en el servidor desde la planilla) a los componentes del navegador. */
export function CatalogProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

export function useProducts() {
  return useContext(CatalogContext);
}
