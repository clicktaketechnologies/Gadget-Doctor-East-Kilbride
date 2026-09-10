import type { NextConfig } from "next";

// When BUILD_TARGET=firebase, export a static site for Firebase Hosting.
// Otherwise (Render/local), run as a normal Next.js server app.
const isFirebaseBuild = process.env.BUILD_TARGET === "firebase";

const nextConfig: NextConfig = {
  ...(isFirebaseBuild
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai", "*.chatglm.cn", "*.z.ai"],
  // Global CORS headers — applied to ALL API routes on Render.
  // This is a THIRD layer of CORS (alongside middleware/proxy + route handlers).
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PATCH, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
