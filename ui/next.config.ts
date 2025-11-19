import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  output: "standalone",
  images: {
    qualities: [100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**/**",
      },
      {
        protocol: "https",
        hostname: "storage.fazerlane.com",
        port: "",
        pathname: "/**/**",
      },
    ],
  },
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/auth/:path*",
          destination: "https://api.fazerlane.com/auth/:path*",
        },
        {
          source: "/api/:path*",
          destination: "https://api.fazerlane.com/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
