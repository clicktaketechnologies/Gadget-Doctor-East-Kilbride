// Mock JWT-like auth (NOT for production — demo only)
import { ADMIN_DEMO } from "@/lib/brand";

export function makeToken(name: string): string {
  const payload = {
    name,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 12, // 12h
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function verifyToken(token: string | null | undefined): { name: string } | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    if (!payload.exp || payload.exp < Date.now()) return null;
    return { name: payload.name };
  } catch {
    return null;
  }
}

/** Admin auth check for API routes. Returns true if authorised. */
export function isAdminAuthorized(req: Request): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  return verifyToken(token) !== null;
}

export { ADMIN_DEMO };
