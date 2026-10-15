import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BagDrawer } from "@/components/BagDrawer";
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
  title: { default: `${site.name} | Moda femenina de autor en Paraguay`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: "es_PY", type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PY" className={`${playfair.variable} ${geist.variable}`}>
      <body className="min-h-dvh">
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
      </body>
    </html>
  );
}
