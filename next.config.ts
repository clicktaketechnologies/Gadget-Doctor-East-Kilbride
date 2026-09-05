import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: "output: standalone" is removed — it's incompatible with "next start".
  // We use "next start" which works with the standard build output.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the sandbox preview panel (preview-chat-*.space-z.ai) to load
  // dev-mode /_next/* resources cross-origin. Without this the preview iframe
  // loads a blank page because Next.js blocks cross-origin dev asset requests.
  allowedDevOrigins: ["*.space-z.ai", "*.chatglm.cn", "*.z.ai"],
};

export default nextConfig;
