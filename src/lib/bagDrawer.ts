"use client";

import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export const bagDrawer = {
  open() {
    open = true;
    emit();
  },
  close() {
    open = false;
    emit();
  },
};

export function useBagDrawerOpen() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => open,
    () => false,
  );
}
