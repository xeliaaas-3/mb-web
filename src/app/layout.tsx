import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ToastHost } from "@/components/ToastHost";
import { site } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: { default: `${site.name} | Moda femenina de autor en Paraguay`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: "es_PY", type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PY" className={`${playfair.variable} ${inter.variable} ${montserrat.variable}`}>
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
        <Suspense>
          <BottomNav />
        </Suspense>
        <ToastHost />
      </body>
    </html>
  );
}
