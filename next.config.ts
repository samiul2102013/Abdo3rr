import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "72.62.248.97",
        port: "85",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;