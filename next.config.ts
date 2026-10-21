import type { NextConfig } from "next";
import { optimizedImageHosts } from "./src/lib/images";

const nextConfig: NextConfig = {
  images: {
    // Unsplash (fotos de ejemplo), Google Drive (fotos pegadas en la planilla), Cloudinary e ImgBB.
    // Otros hosts se muestran sin optimizar (ver isOptimizable en src/lib/images.ts).
    remotePatterns: optimizedImageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
};

export default nextConfig;
