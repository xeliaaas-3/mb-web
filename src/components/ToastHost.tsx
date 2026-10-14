"use client";

import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { dismissToast, useToast } from "@/lib/toast";

export function ToastHost() {
  const toast = useToast();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4 md:top-24"
    >
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-md animate-[toast-in_400ms_var(--ease-editorial)] items-center gap-3 border border-hairline bg-white px-4 py-3"
        >
          <CheckCircle2 size={18} strokeWidth={1.5} className="shrink-0 text-whatsapp" />
          <p className="flex-1 text-body-md">{toast.message}</p>
          {toast.href && (
            <Link href={toast.href} onClick={dismissToast} className="shrink-0 link-editorial label-caps">
              {toast.action ?? "Ver"}
            </Link>
          )}
          <button type="button" aria-label="Cerrar aviso" onClick={dismissToast} className="-mr-1 p-1">
            <X size={16} strokeWidth={1.25} />
          </button>
        </div>
      )}
    </div>
  );
}
