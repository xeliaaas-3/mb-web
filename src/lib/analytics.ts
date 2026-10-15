import { track } from "@vercel/analytics";

/**
 * Eventos clave de la tienda. Se envían a Vercel Analytics y, si están configurados,
 * a Google Analytics 4 (NEXT_PUBLIC_GA_ID) y Meta Pixel (NEXT_PUBLIC_META_PIXEL_ID).
 */
type Events = {
  add_to_cart: { product: string; size: string; value: number };
  whatsapp_click: { page: string };
  order_sent: { order: string; items: number; value: number; payment: string; shipping: string };
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const ga4Name: Record<keyof Events, string> = {
  add_to_cart: "add_to_cart",
  whatsapp_click: "contact",
  order_sent: "generate_lead",
};

const metaName: Record<keyof Events, string> = {
  add_to_cart: "AddToCart",
  whatsapp_click: "Contact",
  order_sent: "Lead",
};

export function trackEvent<K extends keyof Events>(name: K, props: Events[K]) {
  try {
    track(name, props);
    const value = "value" in props ? props.value : undefined;
    window.gtag?.("event", ga4Name[name], { ...props, ...(value !== undefined && { currency: "PYG" }) });
    window.fbq?.("track", metaName[name], value !== undefined ? { value, currency: "PYG" } : {});
  } catch {
    // La analítica nunca debe romper la compra.
  }
}
