import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Autorise l'accès aux ressources dev (HMR, etc.) depuis l'URL réseau affichée par Next.
  // Utile quand on ouvre l'app depuis un autre device sur le LAN.
  allowedDevOrigins: ["10.213.137.89", "localhost", "127.0.0.1"],

  // Next buffère le body des rewrites (proxy) pour permettre plusieurs lectures.
  // Default 10MB → les uploads vidéo (limite multer 100MB) sont tronqués.
  experimental: {
    proxyClientMaxBodySize: "100mb",
  },

  // Proxy local: évite les soucis de CORS et rend l'app accessible via l'IP LAN
  // même si l'API tourne sur la machine en :4000.
  async rewrites() {
    // `beforeFiles` : le proxy /api → Express s’applique *avant* la résolution des routes
    // Next (App Router). Un tableau seul est traité comme `afterFiles`, ce qui peut laisser
    // /api/* être résolu en 404 avant d’atteindre le backend.
    return {
      beforeFiles: [
        {
          source: "/api/auth/:path*",
          destination: "http://127.0.0.1:4000/auth/:path*",
        },
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:4000/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
