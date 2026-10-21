import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { CATALOG_TAG, getCatalog } from "@/lib/catalog";

/**
 * Fuerza a releer la planilla ya mismo (sin esperar los 5 minutos).
 * Uso: /api/catalogo/actualizar?clave=<CATALOG_REFRESH_SECRET>
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CATALOG_REFRESH_SECRET;
  if (!secret || request.nextUrl.searchParams.get("clave") !== secret) {
    return Response.json({ ok: false, error: "Clave incorrecta" }, { status: 401 });
  }
  revalidateTag(CATALOG_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  try {
    const { products, source, warnings } = await getCatalog();
    return Response.json({ ok: true, fuente: source, productos: products.length, avisos: warnings });
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 502 });
  }
}
