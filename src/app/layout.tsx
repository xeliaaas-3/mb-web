import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Analytics } from "@/components/Analytics";
import { BagDrawer } from "@/components/BagDrawer";
import { CatalogProvider } from "@/components/CatalogProvider";
import { getProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Ver la nota en src/app/robots.ts: es una demo colgando del dominio de la
  // agencia. robots.txt frena el rastreo; esto frena la indexación, que no es
  // lo mismo.
  robots: { index: false, follow: false, nocache: true },
  title: { default: `${site.name} | Moda femenina de autor en Paraguay`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: "es_PY", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf8f5",
};

// Las páginas se regeneran cada 5 minutos (CATALOG_REFRESH_SECONDS) para tomar los cambios de la planilla.
export const revalidate = 300;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const products = await getProducts();
  return (
    <html lang="es-PY" className={`${playfair.variable} ${geist.variable}`}>
      <body className="min-h-dvh">
        <CatalogProvider products={products}>
          <a
            href="#contenido"
            className="sr-only bg-ink p-3 label-caps text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
          >
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <BagDrawer />
          <Analytics />
        </CatalogProvider>
      </body>
    </html>
  );
}
