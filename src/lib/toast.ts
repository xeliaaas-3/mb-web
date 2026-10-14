"use client";

import { useSyncExternalStore } from "react";

export type Toast = { id: number; message: string; href?: string; action?: string };

let current: Toast | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export function showToast(t: Omit<Toast, "id">) {
  current = { ...t, id: Date.now() };
  emit();
  clearTimeout(timer);
  timer = setTimeout(dismissToast, 4000);
}

export function dismissToast() {
  current = null;
  emit();
}

export function useToast() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => current,
    () => null,
  );
}
