"use client";

import { useSyncExternalStore } from "react";
import { getProduct, type Product } from "./products";

export type CartLine = { slug: string; size: string; color: string; qty: number };
export type ResolvedLine = CartLine & { key: string; product: Product; lineTotal: number; maxQty: number };

const STORAGE_KEY = "alba-bolsa-v1";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

export const lineKey = (l: Pick<CartLine, "slug" | "size" | "color">) => `${l.slug}|${l.size}|${l.color}`;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      lines = parsed.filter(
        (l): l is CartLine =>
          typeof l?.slug === "string" &&
          typeof l?.size === "string" &&
          typeof l?.color === "string" &&
          Number.isInteger(l?.qty) &&
          l.qty > 0 &&
          !!getProduct(l.slug),
      );
    }
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento (modo privado): la bolsa vive solo en memoria.
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

function getSnapshot() {
  load();
  return lines;
}

function maxQtyFor(slug: string, size: string) {
  return getProduct(slug)?.sizes.find((s) => s.label === size)?.stock ?? 0;
}

export const cart = {
  add(item: Omit<CartLine, "qty">, qty = 1) {
    load();
    const key = lineKey(item);
    const max = maxQtyFor(item.slug, item.size);
    const existing = lines.find((l) => lineKey(l) === key);
    if (existing) {
      commit(lines.map((l) => (l === existing ? { ...l, qty: Math.min(l.qty + qty, max) } : l)));
    } else {
      commit([...lines, { ...item, qty: Math.min(qty, max) }]);
    }
  },
  setQty(key: string, qty: number) {
    commit(
      lines.map((l) => (lineKey(l) === key ? { ...l, qty: Math.max(1, Math.min(qty, maxQtyFor(l.slug, l.size))) } : l)),
    );
  },
  remove(key: string) {
    commit(lines.filter((l) => lineKey(l) !== key));
  },
  clear() {
    commit([]);
  },
};

export function useCart() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const items: ResolvedLine[] = raw.map((l) => {
    const product = getProduct(l.slug)!;
    return { ...l, key: lineKey(l), product, lineTotal: product.price * l.qty, maxQty: maxQtyFor(l.slug, l.size) };
  });
  return {
    items,
    count: raw.reduce((n, l) => n + l.qty, 0),
    subtotal: items.reduce((n, l) => n + l.lineTotal, 0),
  };
}
