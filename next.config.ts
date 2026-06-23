import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Resume uploads (PDFs) are sent through a Server Action.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
