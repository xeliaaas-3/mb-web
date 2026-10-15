"use client";

import { useSyncExternalStore } from "react";
import { useProducts } from "@/components/CatalogProvider";

const STORAGE_KEY = "alba-favoritos-v1";
const EMPTY: string[] = [];

let slugs: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(parsed)) slugs = parsed.filter((s): s is string => typeof s === "string");
  } catch {
    slugs = EMPTY;
  }
}

function commit(next: string[]) {
  slugs = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento: los favoritos viven solo en memoria.
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export const favorites = {
  toggle(slug: string) {
    load();
    commit(slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug]);
  },
};

/** Favoritos que siguen existiendo en el catálogo. */
export function useFavorites() {
  const products = useProducts();
  const saved = useSyncExternalStore(
    subscribe,
    () => {
      load();
      return slugs;
    },
    () => EMPTY,
  );
  return saved.filter((slug) => products.some((p) => p.slug === slug));
}
