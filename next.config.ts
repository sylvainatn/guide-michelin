import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Autorise l'accès aux ressources dev (HMR, etc.) depuis l'URL réseau affichée par Next.
  // Utile quand on ouvre l'app depuis un autre device sur le LAN.
  allowedDevOrigins: ["10.213.137.89", "localhost", "127.0.0.1"],

  // Proxy local: évite les soucis de CORS et rend l'app accessible via l'IP LAN
  // même si l'API tourne sur la machine en :4000.
  async rewrites() {
    return [
      // Auth: le backend expose /auth/*
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:4000/auth/:path*",
      },

      // Fallback: /api/* -> API root (si vous ajoutez d’autres routes backend ensuite)
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
