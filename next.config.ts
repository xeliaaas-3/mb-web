import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos provisorias de Google Stitch. Al migrar a fotos propias, servirlas desde /public o un CDN y quitar esto.
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;
