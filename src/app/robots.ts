import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * ⚠ TIENDA DE DEMOSTRACIÓN: BLOQUEADA PARA BUSCADORES.
 *
 * Vive en un subdominio del dominio de la agencia (tienda.studioxcreative.digital).
 * Indexada competiría con el posicionamiento del sitio real de StudioX y podría
 * aparecer en búsquedas de la marca, con precios y datos de cobro que son de
 * ejemplo.
 *
 * El disallow total y el noindex del layout van juntos a propósito: robots.txt
 * impide el rastreo, pero una URL enlazada desde afuera puede indexarse igual
 * sin haber sido rastreada. El meta robots es el que lo impide de verdad.
 *
 * PARA PUBLICARLA DE VERDAD: sacar este bloqueo, sacar el noindex de
 * src/app/layout.tsx, y reemplazar los datos de cobro de ejemplo de
 * src/lib/site.ts por los reales.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    host: site.url,
  };
}
