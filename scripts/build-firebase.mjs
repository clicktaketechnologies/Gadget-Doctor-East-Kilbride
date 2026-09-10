// Build script for Firebase static export.
// Temporarily removes the /api routes and middleware (they only run on Render)
// so Next.js 'output: export' succeeds, then restores them after.
import { execSync } from "node:child_process";
import { existsSync, renameSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const apiDir = join(root, "src", "app", "api");
const apiBackup = join(root, ".api-backup");
const middlewareFile = join(root, "src", "middleware.ts");
const middlewareBackup = join(root, ".middleware-backup.ts");
const proxyFile = join(root, "src", "proxy.ts");
const proxyBackup = join(root, ".proxy-backup.ts");

console.log("🔥 Building static site for Firebase Hosting...");
console.log("   (API routes run on Render — temporarily removing them from this build)\n");

// 1. Move src/app/api → .api-backup
if (existsSync(apiDir)) {
  if (existsSync(apiBackup)) rmSync(apiBackup, { recursive: true, force: true });
  renameSync(apiDir, apiBackup);
  console.log("   ✓ Moved src/app/api out of the build");
}

// 2. Move src/middleware.ts → .middleware-backup.ts
if (existsSync(middlewareFile)) {
  renameSync(middlewareFile, middlewareBackup);
  console.log("   ✓ Moved src/middleware.ts out of the build");
}

// 2b. Move src/proxy.ts → .proxy-backup.ts (Next.js 16 renamed middleware → proxy)
if (existsSync(proxyFile)) {
  renameSync(proxyFile, proxyBackup);
  console.log("   ✓ Moved src/proxy.ts out of the build");
}

try {
  // 3. Run the Next.js build with Firebase export settings
  // Merge process.env (which includes NEXT_PUBLIC_API_BASE_URL from GitHub Actions)
  // with the build-specific vars.
  const buildEnv = {
    ...process.env,
    BUILD_TARGET: "firebase",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://gadget-doctor-east-kilbride.onrender.com",
  };
  execSync("next build", {
    stdio: "inherit",
    cwd: root,
    shell: true,
    env: buildEnv,
  });
  console.log("\n✅ Firebase static export build complete (out/ directory created).");

  // 4. Remove the /admin and /superadmin static pages so Firebase's redirect
  // rules take effect (otherwise Firebase serves the static HTML instead of
  // redirecting to Render). The admin dashboard must run on Render (it needs
  // server-side API access).
  const outAdmin = join(root, "out", "admin");
  const outSuperadmin = join(root, "out", "superadmin");
  if (existsSync(outAdmin)) {
    rmSync(outAdmin, { recursive: true, force: true });
    console.log("   ✓ Removed out/admin (redirects to Render via firebase.json)");
  }
  if (existsSync(outSuperadmin)) {
    rmSync(outSuperadmin, { recursive: true, force: true });
    console.log("   ✓ Removed out/superadmin (redirects to Render via firebase.json)");
  }
} catch (e) {
  console.error("\n❌ Build failed.");
  process.exitCode = 1;
} finally {
  // 4. ALWAYS restore the moved files, even if the build failed
  if (existsSync(apiBackup)) {
    if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true });
    mkdirSync(join(root, "src", "app"), { recursive: true });
    renameSync(apiBackup, apiDir);
    console.log("   ✓ Restored src/app/api");
  }
  if (existsSync(middlewareBackup)) {
    renameSync(middlewareBackup, middlewareFile);
    console.log("   ✓ Restored src/middleware.ts");
  }
  if (existsSync(proxyBackup)) {
    renameSync(proxyBackup, proxyFile);
    console.log("   ✓ Restored src/proxy.ts");
  }
}
