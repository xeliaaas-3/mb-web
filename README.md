# Alba Boutique — tienda web de ejemplo

Next.js 16 (App Router) + Tailwind CSS 4. Basada en el diseño de Google Stitch "Haute Editorial Boutique".

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Cómo está armado

| Ruta | Archivo |
| --- | --- |
| `/` inicio | `src/app/page.tsx` |
| `/catalogo` (filtros en la URL: `categoria`, `coleccion`, `talle`, `color`, `max`, `orden`, `buscar`) | `src/app/catalogo/CatalogView.tsx` |
| `/prenda/[slug]` (generada estática por prenda) | `src/app/prenda/[slug]/` |
| `/bolsa` bolsa + checkout por WhatsApp | `src/app/bolsa/BagView.tsx` |

- **Tokens de diseño**: `src/app/globals.css` (`@theme`). Paleta, tipografías, radio 0 y utilidades `label-caps`, `page-x`, `link-editorial`.
- **Prendas, talles, stock y precios**: `src/lib/products.ts`.
- **Datos del negocio** (WhatsApp, dirección, horarios, envíos, medios de pago, meta de envío gratis): `src/lib/site.ts`.
- **Bolsa**: `src/lib/cart.ts`, guardada en `localStorage` del navegador.
- **Mensaje de WhatsApp**: `src/lib/order.ts` (`buildOrderMessage`). El checkout valida datos, arma el pedido en texto y abre `wa.me/<número>?text=…`.

## Pendiente antes de publicar

- Reemplazar las imágenes de `src/lib/images.ts` (generadas por IA en Stitch, alojadas en Google) por fotos reales en `public/` y quitar `images.remotePatterns` de `next.config.ts`.
- Revisar precios, stock, textos de prendas, reseñas, cuenta de Instagram y dirección.
- El stock está en el código: no se descuenta solo. Las asesoras confirman disponibilidad por WhatsApp.
