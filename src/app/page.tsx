import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import PublicSite from "@/components/public/public-site";

/**
 * Home route (`/`) — renders the public SPA.
 *
 * generateMetadata provides a SELF-REFERENTIAL canonical (https://site/)
 * and the home title/description. The catch-all route
 * (src/app/[...slug]/page.tsx) provides per-page metadata for every other
 * deep link. Together these fix Ahrefs C1 (duplicate canonical) + C2
 * (duplicate title/description).
 */
export function generateMetadata(): Metadata {
  const url = `${BRAND.website}/`;
  return {
    title: `${BRAND.fullName} | ${BRAND.tagline}`,
    description:
      "Gadget Doctor East Kilbride repairs phones, tablets, laptops, MacBooks, computers, custom PCs, games consoles and Apple Watches. Same-day repairs, doorstep collection across East Kilbride & surrounding areas. Call +44 1355 458135.",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      siteName: BRAND.fullName,
      title: `${BRAND.fullName} | ${BRAND.tagline}`,
      description:
        "Fast & reliable electronics repair in East Kilbride. Same-day service, doorstep collection.",
      images: [
        {
          url: `${BRAND.website}/gadget-doctor-logo.jpg`,
          width: 1200,
          height: 630,
          alt: BRAND.fullName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${BRAND.fullName} | ${BRAND.tagline}`,
      description:
        "Fast & reliable electronics repair in East Kilbride. Same-day service, doorstep collection.",
      images: [`${BRAND.website}/gadget-doctor-logo.jpg`],
    },
  };
}

export default function Home() {
  return <PublicSite />;
}
