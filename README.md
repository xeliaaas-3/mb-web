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
| `/lookbook`, `/gift-card`, `/favoritos` | looks completos, gift cards por WhatsApp y prendas guardadas |
| `/nosotras`, `/contacto`, `/guia-de-talles`, `/envios-y-cambios`, `/preguntas-frecuentes` | páginas institucionales y de ayuda |

- **Tokens de diseño**: `src/app/globals.css` (`@theme`). Fondo crema, tarjetas blancas redondeadas, Playfair Display + Geist y utilidades `label-caps`, `page-x`, `link-editorial`.
- **Bolsa lateral** (`src/components/BagDrawer.tsx`) y **asistente de talles** (`src/components/SizeAssistant.tsx`, medidas en `src/lib/sizes.ts`).
- **Catálogo editable desde Google Sheets** (`src/lib/catalog.ts`): ver [docs/catalogo.md](docs/catalogo.md). Sin planilla configurada se usa el catálogo de ejemplo de `src/lib/products.ts` (47 productos), donde también están categorías y colecciones.
- **Textos** (beneficios, looks, reseñas, preguntas frecuentes, políticas, montos de gift card): `src/lib/content.ts`.
- **Datos del negocio** (WhatsApp, dirección, horarios, envíos, medios de pago, meta de envío gratis): `src/lib/site.ts`.
- **Bolsa**: `src/lib/cart.ts`, guardada en `localStorage` del navegador.
- **Mensaje de WhatsApp**: `src/lib/order.ts` (`buildOrderMessage`). El checkout valida datos, arma el pedido en texto y abre `wa.me/<número>?text=…`.

## Pendiente antes de publicar

- Reemplazar las fotos de ejemplo de `src/lib/images.ts` (Unsplash, licencia libre) por fotos reales de las prendas en `public/` y ajustar `images.remotePatterns` de `next.config.ts`.
- Revisar precios, stock, textos de prendas, reseñas, looks, preguntas frecuentes y políticas (`src/lib/products.ts` y `src/lib/content.ts`), cuenta de Instagram y dirección.
- El stock se carga en la planilla y no se descuenta solo con cada pedido. Las asesoras confirman disponibilidad por WhatsApp.

## Compartir, Google y analítica

- **Imagen al compartir** el link (WhatsApp, Instagram, Facebook): `src/app/opengraph-image.jpg` (1200×630, menos de 300 KB para que WhatsApp la muestre). Las fichas usan la foto de cada prenda.
- **Google**: `/sitemap.xml`, `/robots.txt` y datos estructurados (tienda en el inicio, producto con precio y stock en cada ficha). La URL pública sale de `NEXT_PUBLIC_SITE_URL` (por defecto `https://mb-web-drab.vercel.app`); al pasar al dominio propio, cambiarla en Vercel.
- **Analítica** (`src/components/Analytics.tsx`, eventos en `src/lib/analytics.ts`): visitas con Vercel Analytics (hay que activarlo en el proyecto de Vercel, pestaña *Analytics*). Opcionales, con variables de entorno en Vercel:
  - `NEXT_PUBLIC_GA_ID` → Google Analytics 4 (`G-XXXXXXX`).
  - `NEXT_PUBLIC_META_PIXEL_ID` → Meta Pixel, para medir campañas de Instagram/Facebook.
  - Eventos: `add_to_cart`, `whatsapp_click` (cualquier link a WhatsApp) y `order_sent` (pedido enviado, con monto).

## Datos de pago

Después de enviar el pedido, la clienta ve cómo pagar según el método elegido (cuenta bancaria, billetera o pago al recibir), con botones para copiar cada dato. **Los datos en `paymentDetails` de `src/lib/site.ts` son de ejemplo**: reemplazarlos por los reales antes de publicar.
