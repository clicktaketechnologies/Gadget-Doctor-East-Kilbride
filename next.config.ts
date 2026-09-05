import type { NextConfig } from "next";

// When BUILD_TARGET=firebase, export a static site for Firebase Hosting.
// Otherwise (Render/local), run as a normal Next.js server app.
const isFirebaseBuild = process.env.BUILD_TARGET === "firebase";

const nextConfig: NextConfig = {
  ...(isFirebaseBuild
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        // Static export: trailing slashes so /admin/ works on Firebase
        trailingSlash: true,
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai", "*.chatglm.cn", "*.z.ai"],
};

export default nextConfig;
