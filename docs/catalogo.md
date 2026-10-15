# Catálogo editable (Google Sheets)

Las prendas de la tienda se cargan desde una Google Sheet. Cambiás la planilla y la web se actualiza sola en hasta 5 minutos, sin tocar código.

## Cómo está organizada

- Pestaña **Instrucciones**: guía rápida para quien carga las prendas (la web no la lee).
- Una pestaña por categoría: **Vestidos, Blusas & tops, Pantalones, Faldas, Conjuntos, Monos, Blazers & abrigos, Carteras, Bijouterie, Calzado, Sombreros, cintos & lentes**.
- Todas tienen las mismas columnas, listas desplegables (categoría, etiqueta, activo), fecha validada y una nota en cada título.

## Puesta en marcha (una sola vez)

1. **Archivo → Compartir → Publicar en la web**, elegí **Todo el documento** y **Valores separados por comas (.csv)**, y publicá. (También sirve compartir con "Cualquier persona con el enlace: Lector".)
2. Cada pestaña tiene su número `gid` (aparece en la dirección al abrir la pestaña: `...#gid=202`). En la planilla de Alba son:

   | Pestaña | gid |
   | --- | --- |
   | Vestidos | 101 |
   | Blusas & tops | 202 |
   | Pantalones | 203 |
   | Faldas | 204 |
   | Conjuntos | 205 |
   | Monos | 206 |
   | Blazers & abrigos | 207 |
   | Carteras | 208 |
   | Bijouterie | 209 |
   | Calzado | 210 |
   | Sombreros, cintos & lentes | 211 |

3. Armá una URL por pestaña:
   - Publicada en la web: `https://docs.google.com/spreadsheets/d/e/ID_PUBLICADO/pub?gid=GID&single=true&output=csv`
   - Compartida con enlace: `https://docs.google.com/spreadsheets/d/ID_DE_LA_PLANILLA/export?format=csv&gid=GID`
4. En el hosting (Vercel o Cloudflare), cargá las variables de entorno y volvé a publicar:
   - `CATALOG_SHEET_CSV_URL` = las 11 URLs separadas por espacios o saltos de línea.
   - `CATALOG_REFRESH_SECRET` = una clave cualquiera, para actualizar al instante.

Si más adelante agregás una pestaña nueva, sumá su URL a `CATALOG_SHEET_CSV_URL`.

## Cómo se completa cada columna

Una fila por prenda. La primera fila son los títulos (no cambiarlos). Si una fila no tiene categoría, toma la de su pestaña.

| Columna | Obligatoria | Ejemplo | Notas |
| --- | --- | --- | --- |
| `nombre` | sí | Vestido camisero terracota | |
| `categoria` | | Vestidos | Vestidos, Blusas & tops, Pantalones, Faldas, Conjuntos, Monos, Blazers & abrigos, Carteras, Bijouterie, Calzado, Sombreros/cintos/lentes. También entiende "vestido", "blusa", "zapato", "bolso"… |
| `precio` | sí | 289000 | Se puede escribir `289.000` o `Gs. 289.000`. |
| `precio_anterior` | | 340000 | Si es mayor que el precio, la prenda entra al **Sale** y muestra el descuento. |
| `etiqueta` | | Nuevo | Nuevo, Más vendido, Últimas unidades, Edición especial u Oferta. "Nuevo" la suma a **Nuevos ingresos**. |
| `colecciones` | | verano, oficina | verano, fiesta, oficina, tejidos (separadas por coma). |
| `material` | | Lino y viscosa | |
| `colores` | | Negro, Terracota #c0583c | Nombre y, opcional, el color en código `#`. |
| `talles` | | S:2, M:3, L:0 | Talle y stock. Con stock 0 aparece tachado como agotado. Para accesorios: `Único:5`. |
| `fotos` | sí | (links) | Uno o más links, uno por línea. Sirven links de Google Drive (la foto tiene que estar compartida con "cualquier persona con el enlace"), Cloudinary, ImgBB o cualquier link directo a una imagen. La primera es la principal. |
| `descripcion` | | | Cada línea es un párrafo. |
| `ingreso` | | 15/10/2026 | Fecha de ingreso. Ordena **Nuevos ingresos** (sin fecha, la prenda va al final). |
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
