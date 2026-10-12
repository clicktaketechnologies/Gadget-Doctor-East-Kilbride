/**
 * Pure URL → page mapping (no React/Zustand deps).
 *
 * Shared between:
 *   - the client store (src/lib/store.ts) — to sync SPA state from the URL
 *   - the server catch-all route (src/app/[...slug]/page.tsx generateMetadata)
 *
 * Keeping this framework-agnostic lets the server compute per-page SEO metadata
 * (title / description / canonical) at request time without duplicating the
 * routing logic. This is the foundation of the Ahrefs C1+C2 fix (duplicate
 * canonical + duplicate title/description across all SPA deep links).
 */

export type PublicPage =
  | "home"
  | "services"
  | "service-detail"
  | "collection"
  | "reviews"
  | "contact"
  | "blog"
  | "blog-detail"
  | "track";

export interface PathPageInfo {
  page: PublicPage;
  category?: string;
  blogSlug?: string;
}

/**
 * Map a URL pathname to a public page + optional service category / blog slug.
 * /services            -> services listing
 * /services/<category> -> service detail (mobile, tablet, laptop, macbook, …)
 * /collection          -> doorstep collection
 * /reviews             -> customer reviews
 * /contact             -> contact + map + hours
 * /track               -> ticket tracker
 * /blog                -> blog listing
 * /blog/<slug>         -> blog post detail
 * everything else      -> home
 */
export function pathnameToPage(pathname: string): PathPageInfo {
  let p = pathname.replace(/\/+$/, "");
  if (!p.startsWith("/")) p = "/" + p;
  if (p === "" || p === "/") return { page: "home" };

  // admin + api are separate routes — never map them here
  if (p === "/admin" || p.startsWith("/admin/")) return { page: "home" };
  if (p === "/superadmin" || p.startsWith("/superadmin/")) return { page: "home" };

  const segments = p.split("/").filter(Boolean);

  switch (segments[0]) {
    case "services":
      if (segments[1]) return { page: "service-detail", category: segments[1] };
      return { page: "services" };
    case "collection":
      return { page: "collection" };
    case "reviews":
      return { page: "reviews" };
    case "contact":
      return { page: "contact" };
    case "track":
      return { page: "track" };
    case "blog":
      if (segments[1]) return { page: "blog-detail", blogSlug: segments[1] };
      return { page: "blog" };
    default:
      return { page: "home" };
  }
}
