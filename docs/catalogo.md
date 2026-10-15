# Catálogo editable (Google Sheets)

Las prendas de la tienda se cargan desde una Google Sheet. Cambiás la planilla y la web se actualiza sola en hasta 5 minutos, sin tocar código.

## Puesta en marcha (una sola vez)

1. Abrí la planilla **Alba Boutique — Catálogo** en Google Drive (o importá `docs/catalogo-plantilla.csv` en una planilla nueva).
2. **Compartir → Acceso general → "Cualquier persona con el enlace" → Lector.** Sin esto la web no puede leerla.
3. Armá la URL de lectura con el ID de la planilla (lo que va entre `/d/` y `/edit` en la dirección):

   ```
   https://docs.google.com/spreadsheets/d/ID_DE_LA_PLANILLA/export?format=csv&gid=0
   ```

   `gid=0` es la primera pestaña. Si los productos están en otra pestaña, usá el número que aparece después de `gid=` en la dirección.
4. En el hosting (Vercel o Cloudflare), cargá las variables de entorno y volvé a publicar:
   - `CATALOG_SHEET_CSV_URL` = la URL del paso 3.
   - `CATALOG_REFRESH_SECRET` = una clave cualquiera, para el botón de actualizar ya.

## Cómo se completa cada columna

Una fila por prenda. La primera fila son los títulos (no cambiarlos). Las filas de arriba se muestran como las más nuevas.

| Columna | Obligatoria | Ejemplo | Notas |
| --- | --- | --- | --- |
| `nombre` | sí | Vestido camisero terracota | |
| `categoria` | sí | Vestidos | Vestidos, Blusas & tops, Pantalones, Faldas, Conjuntos, Monos, Blazers & abrigos, Carteras, Bijouterie, Calzado, Sombreros/cintos/lentes. También entiende "vestido", "blusa", "zapato", "bolso"… |
| `precio` | sí | 289000 | Se puede escribir `289.000` o `Gs. 289.000`. |
| `precio_anterior` | | 340000 | Si es mayor que el precio, la prenda entra al **Sale** y muestra el descuento. |
| `etiqueta` | | Nuevo | Nuevo, Más vendido, Últimas unidades, Edición especial u Oferta. "Nuevo" la suma a **Nuevos ingresos**. |
| `colecciones` | | verano, oficina | verano, fiesta, oficina, tejidos (separadas por coma). |
| `material` | | Lino y viscosa | |
| `colores` | | Negro, Terracota #c0583c | Nombre y, opcional, el color en código `#`. |
| `talles` | | S:2, M:3, L:0 | Talle y stock. Con stock 0 aparece tachado como agotado. Para accesorios: `Único:5`. |
| `fotos` | sí | (links) | Uno o más links, uno por línea. Sirven links de Google Drive (la foto tiene que estar compartida con "cualquier persona con el enlace"), Cloudinary, ImgBB o cualquier link directo a una imagen. La primera es la principal. |
| `descripcion` | | | Cada línea es un párrafo. |
| `vendidos` | | 64 | Ordena "Más vendidos". |
| `slug` | | vestido-camisero-terracota | La dirección de la prenda (`/prenda/...`). Si se deja vacío se arma con el nombre. **No cambiarlo** en prendas ya publicadas, porque se rompen los links compartidos. |
| `activo` | | sí | Poné `no` para ocultar la prenda sin borrarla. |

## Actualizar ya (sin esperar 5 minutos)

Abrí en el navegador:

```
https://TU-DOMINIO/api/catalogo/actualizar?clave=CATALOG_REFRESH_SECRET
```

Responde cuántos productos leyó y los **avisos**: filas que se saltearon y por qué (por ejemplo, "Fila 12 (Vestido X): precio inválido").

## Si algo sale mal

- Una fila con error (sin precio, sin fotos o con una categoría desconocida) se saltea y el resto se publica.
- Si la planilla no responde, la tienda sigue mostrando la última versión que leyó bien.
- Si en un deploy nuevo la planilla no es pública o la URL está mal, el deploy falla con el error, en vez de publicar productos equivocados.
- Sin `CATALOG_SHEET_CSV_URL`, la tienda muestra el catálogo de ejemplo de `src/lib/products.ts`.
