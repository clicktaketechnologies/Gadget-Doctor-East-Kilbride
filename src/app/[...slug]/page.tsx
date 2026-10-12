import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/brand";
import { pathnameToPage, type PublicPage } from "@/lib/seo-routes";
import PublicSite from "@/components/public/public-site";

/**
 * Catch-all route — serves the SPA for all public deep links AND provides
 * per-page server-side SEO metadata.
 *
 * This is the core of the Ahrefs Site Audit fix (project 5991516):
 *   - C1 (duplicate canonical): generateMetadata sets a SELF-REFERENTIAL
 *     canonical for each path, so /services canonicalizes to /services
 *     (not to / as the static layout canonical did before).
 *   - C2 (duplicate title/description): generateMetadata returns a unique
 *     title + description per page, server-rendered into the HTML head.
 *   - 4XX pages: this route exists so /services, /blog, /contact etc.
 *     return 200 instead of 404.
 *
 * Supported deep links (all return 200 with correct metadata):
 *   /services            -> services listing
 *   /services/<category> -> service detail (mobile, tablet, laptop, …)
 *   /collection          -> doorstep collection
 *   /reviews             -> customer reviews
 *   /contact             -> contact + map + hours
 *   /track               -> ticket tracker
 *   /blog                -> blog listing
 *   /blog/<slug>         -> blog post detail (fetches the post for title/excerpt)
 *
 * Static routes (/admin, /superadmin, /api/*, /favicon.ico) take precedence
 * over this catch-all in the App Router, so they're unaffected.
 */

const SITE_URL = BRAND.website;

function buildMetadata(
  page: PublicPage,
  category: string | undefined,
  blogSlug: string | undefined,
  blogPost: { title: string; excerpt: string; coverImage: string | null } | null,
  pathname: string
): Metadata {
  const canonical = `${SITE_URL}${pathname}`;
  let title: string;
  let description: string;
  let image = `${SITE_URL}/gadget-doctor-logo.jpg`;

  const cat = category
    ? SERVICE_CATEGORIES.find((c) => c.value === category)
    : null;

  switch (page) {
    case "services":
      title = `Repair Services in East Kilbride | ${BRAND.fullName}`;
      description =
        "Browse all electronics repair services at Gadget Doctor East Kilbride — phone, tablet, laptop, MacBook, computer, custom PC, games console and Apple Watch repairs. Same-day service, genuine-grade parts, 12-month warranty. Call +44 1355 458135.";
      image = `${SITE_URL}/images/services-grid.jpg`;
      break;

    case "service-detail":
      if (cat) {
        title = `${cat.label} in East Kilbride | ${BRAND.fullName}`;
        description = `${cat.description} Same-day service, genuine-grade parts and a 12-month warranty from Gadget Doctor East Kilbride. Book online or call +44 1355 458135.`;
        image = `${SITE_URL}/images/services-grid.jpg`;
      } else {
        title = `Repair Services in East Kilbride | ${BRAND.fullName}`;
        description = "Electronics repair services at Gadget Doctor East Kilbride. Same-day service, 12-month warranty.";
        image = `${SITE_URL}/images/services-grid.jpg`;
      }
      break;

    case "collection":
      title = `Doorstep Collection Service | ${BRAND.fullName}`;
      description = `Doorstep collection and return across ${BRAND.targetAreas.join(
        ", "
      )}. Book your repair online and we'll pick up your device, fix it, and drop it back. Call +44 1355 458135.`;
      image = `${SITE_URL}/images/collection-van.jpg`;
      break;

    case "reviews":
      title = `Customer Reviews | ${BRAND.fullName}`;
      description = `Read ${BRAND.rating}★ reviews from happy Gadget Doctor East Kilbride customers — cracked iPhone screens, PS5 HDMI repairs, MacBook logic-board fixes, custom gaming PC builds and more. ${BRAND.reviewCount}+ verified reviews.`;
      break;

    case "contact":
      title = `Contact Us | ${BRAND.fullName}`;
      description = `Visit Gadget Doctor East Kilbride at ${BRAND.addressShort}. Call ${BRAND.phones[0]}. Mon–Thu 09:30–15:00, Fri 09:30–14:30, Sat 10:00–14:00, Sun closed. Doorstep collection available across East Kilbride & surrounding areas.`;
      image = `${SITE_URL}/images/contact-shop.jpg`;
      break;

    case "track":
      title = `Track Your Repair | ${BRAND.fullName}`;
      description =
        "Track your Gadget Doctor repair by ticket ID (GD-XXXX). Real-time status, technician notes and pricing. Book online or call +44 1355 458135.";
      break;

    case "blog":
      title = `Repair Tips, Guides & News | ${BRAND.fullName}`;
      description =
        "Practical repair advice, step-by-step guides and workshop news from Gadget Doctor East Kilbride technicians. iPhone screens, PS5 HDMI, MacBook water damage, custom PC builds and more.";
      break;

    case "blog-detail":
      if (blogPost) {
        title = `${blogPost.title} | ${BRAND.fullName}`;
        description = blogPost.excerpt;
        image = blogPost.coverImage
          ? blogPost.coverImage.startsWith("http")
            ? blogPost.coverImage
            : `${SITE_URL}${blogPost.coverImage}`
          : image;
      } else {
        title = `Blog | ${BRAND.fullName}`;
        description =
          "Repair tips, guides and workshop news from Gadget Doctor East Kilbride.";
      }
      break;

    default: // home
      title = `${BRAND.fullName} | ${BRAND.tagline}`;
      description =
        "Gadget Doctor East Kilbride repairs phones, tablets, laptops, MacBooks, computers, custom PCs, games consoles and Apple Watches. Same-day repairs, 12-month warranty, doorstep collection across East Kilbride & surrounding areas. Call +44 1355 458135.";
  }

  return {
    title,
    description,
    alternates: {
      canonical, // SELF-REFERENTIAL — the key C1 fix
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

type Params = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pathname = "/" + (slug?.join("/") || "");
  const { page, category, blogSlug } = pathnameToPage(pathname);

  let blogPost: { title: string; excerpt: string; coverImage: string | null } | null = null;
  if (page === "blog-detail" && blogSlug) {
    try {
      const post = await db.blogPost.findUnique({
        where: { slug: blogSlug },
        select: { title: true, excerpt: true, coverImage: true, published: true },
      });
      // Only serve metadata for published posts (don't leak draft titles)
      if (post && post.published) {
        blogPost = { title: post.title, excerpt: post.excerpt, coverImage: post.coverImage };
      }
    } catch {
      // DB unreachable at build time — fall back to generic blog metadata.
      // The client-side SeoHead will still update the title post-hydration
      // for JS-enabled visitors once the /api/blog endpoint responds.
    }
  }

  return buildMetadata(page, category, blogSlug, blogPost, pathname);
}

/**
 * generateStaticParams — required for `output: export` (static export to
 * Firebase Hosting). Returns every public deep-link path so Next.js
 * pre-renders each as a separate HTML file with its own per-page metadata
 * (the C1/C2 fix — unique title + self-referential canonical per path).
 *
 * Blog slugs are fetched from the DB at build time; if the DB is unreachable
 * (e.g. local build without a connection string), the known seed slugs are
 * used as a fallback so the build never fails.
 */
const FALLBACK_BLOG_SLUGS = [
  "cracked-iphone-screen-repair-guide",
  "ps5-hdmi-port-repair-explained",
  "macbook-water-damage-what-to-do",
  "custom-gaming-pc-build-guide",
];
const SERVICE_CATEGORIES_VALUES = SERVICE_CATEGORIES.map((c) => c.value);

export async function generateStaticParams() {
  // Try to fetch published blog slugs from the DB for a complete sitemap.
  let blogSlugs = FALLBACK_BLOG_SLUGS;
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    if (posts.length > 0) {
      blogSlugs = posts.map((p) => p.slug);
    }
  } catch {
    // DB unreachable at build time — use the fallback slugs
  }

  const params: { slug: string[] }[] = [
    { slug: ["services"] },
    ...SERVICE_CATEGORIES_VALUES.map((c) => ({ slug: ["services", c] })),
    { slug: ["collection"] },
    { slug: ["reviews"] },
    { slug: ["contact"] },
    { slug: ["track"] },
    { slug: ["blog"] },
    ...blogSlugs.map((s) => ({ slug: ["blog", s] })),
  ];

  return params;
}

// Server-rendered shell — the client SPA does the actual page rendering
// + reads window.location.pathname via the store's installUrlSync().
export default function CatchAllPage() {
  return <PublicSite />;
}
