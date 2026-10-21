import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

/**
 * Adaptador de Next para Cloudflare Workers.
 *
 * Esta tienda NO puede exportarse estática: el catálogo se lee de una planilla
 * de Google en tiempo de ejecución (fetch con revalidate de 5 minutos) y hay
 * una ruta de API para forzar la relectura. Eso necesita un servidor, y
 * OpenNext es lo que traduce el servidor de Next al runtime de Workers.
 *
 * El caché incremental va a KV: es donde se guarda el resultado de la planilla
 * entre revalidaciones. Sin esto, cada visita volvería a pedir el CSV a Google.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
