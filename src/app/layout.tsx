import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
import { FaviconUpdater } from "@/components/favicon-updater";
import { CustomCodeInjector } from "@/components/custom-code-injector";
import { ServerMetaTags } from "@/components/server-meta-tags";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gadget Doctor East Kilbride — Fast & Reliable Electronics Repair",
  description:
    "Expert phone, laptop, MacBook, console and GHD repairs in East Kilbride. 4.6★ rated, doorstep collection service available. Book your repair today.",
  keywords: [
    "phone repair East Kilbride",
    "iPhone repair Glasgow",
    "MacBook repair",
    "PS5 repair",
    "console repair",
    "GHD repair",
    "data recovery",
  ],
  icons: {
    icon: "/gadget-doctor-logo.jpg",
  },
  // Google Search Console verification
  verification: {
    google: "H-OKElcx2vleyf5JmpMgN3in5UqGlIwjV8z7KRqM7SA",
  },
  // Canonical URL — prevents duplicate content issues
  metadataBase: new URL("https://gadgetdoctorls.co.uk"),
  alternates: {
    canonical: "/",
  },
  // Robots meta — explicitly allow indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Gadget Doctor East Kilbride",
    description: "Fast & Reliable Electronics Repair in East Kilbride",
    type: "website",
    siteName: "Gadget Doctor East Kilbride",
    images: [
      {
        url: "/gadget-doctor-logo.jpg",
        width: 1280,
        height: 720,
        alt: "Gadget Doctor East Kilbride — Electronics Repair Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gadget Doctor East Kilbride",
    description: "Fast & Reliable Electronics Repair in East Kilbride",
  },
};

// Fetch site settings server-side to inject meta tags into the raw HTML
// (Google Search Console verification requires meta tags in the HTML source,
// not injected via JavaScript)
async function getSiteSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${baseUrl}/api/settings`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const headerCode = settings?.customHeaderCode || "";

  // Extract verification meta tags from the header code
  const googleMatch = headerCode.match(/google-site-verification[^>]*content=["']([^"']+)["']/i);
  const bingMatch = headerCode.match(/msvalidate\.01[^>]*content=["']([^"']+)["']/i);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Server-rendered meta tags (visible to Google crawlers in raw HTML) */}
        {googleMatch && (
          <meta name="google-site-verification" content={googleMatch[1]} />
        )}
        {bingMatch && (
          <meta name="msvalidate.01" content={bingMatch[1]} />
        )}
        {/* ServerMetaTags renders all custom header code as raw HTML */}
        {headerCode && <ServerMetaTags html={headerCode} />}

        {/* LocalBusiness + ElectronicsRepairService structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "ElectronicsRepairService"],
              "@id": "https://gadgetdoctorls.co.uk/#business",
              name: "Gadget Doctor East Kilbride",
              description: "Fast & reliable electronics repair in East Kilbride. Expert phone, laptop, MacBook, games console, Apple Watch and custom PC repairs with a 12-month warranty.",
              image: "https://gadgetdoctorls.co.uk/gadget-doctor-logo.jpg",
              logo: "https://gadgetdoctorls.co.uk/gadget-doctor-logo.jpg",
              url: "https://gadgetdoctorls.co.uk/",
              telephone: "+44 7777 200175",
              email: "info@gadgetdoctorscotland.co.uk",
              priceRange: "££",
              currenciesAccepted: "GBP",
              paymentAccepted: "Cash, Credit Card, Debit Card",
              address: {
                "@type": "PostalAddress",
                streetAddress: "14 Stroud Rd, EK Business Centre",
                addressLocality: "East Kilbride",
                addressRegion: "South Lanarkshire",
                postalCode: "G75 0YA",
                addressCountry: "GB",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 55.7477,
                longitude: -4.2259,
              },
              hasMap: "https://maps.app.goo.gl/vsvyX7oc9MFpnEDS6",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
                  opens: "09:30",
                  closes: "15:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Friday",
                  opens: "09:30",
                  closes: "14:30",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "14:00",
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.6",
                reviewCount: "92",
                bestRating: "5",
                worstRating: "1",
              },
              areaServed: [
                { "@type": "City", name: "East Kilbride" },
                { "@type": "City", name: "Busby" },
                { "@type": "City", name: "Eaglesham" },
                { "@type": "City", name: "Cambuslang" },
                { "@type": "City", name: "Rutherglen" },
                { "@type": "City", name: "Carmunnock" },
                { "@type": "City", name: "Giffnock" },
              ],
              sameAs: [
                "https://www.facebook.com/GadgetDoctorEastKilbride/",
                "https://www.instagram.com/gadgetdoctoreastkilbride",
                "https://www.tiktok.com/@gadgetdoctoreastkilbride",
                "https://www.youtube.com/@gadgetdoctoreastkilbride",
                "https://uk.pinterest.com/gadgetdoctoreastkilbride/",
                "https://www.linkedin.com/company/gadget-doctor-east-kilbride",
                "https://gadgetdoctoreastkilbride.blogspot.com/",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Repair Services",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile Phone Repair" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tablet & iPad Repair" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Laptop Repair" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "MacBook Repair" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Computer Repair" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Computer Builds" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Game Console Repair" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Apple Watch Repairs" } },
                ],
              },
            }),
          }}
        />
        {/* BreadcrumbList structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://gadgetdoctorls.co.uk/" },
                { "@type": "ListItem", position: 2, name: "Services", item: "https://gadgetdoctorls.co.uk/services" },
                { "@type": "ListItem", position: 3, name: "Book Repair", item: "https://gadgetdoctorls.co.uk/" },
              ],
            }),
          }}
        />
        {/* WebSite structured data for sitelinks search box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://gadgetdoctorls.co.uk/",
              name: "Gadget Doctor East Kilbride",
              publisher: { "@id": "https://gadgetdoctorls.co.uk/#business" },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://gadgetdoctorls.co.uk/?q={query}",
                "query-input": "required name=query",
              },
            }),
          }}
        />
        {/* Firebase Analytics — initialises on the client */}
        <FirebaseAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>
          {children}
          <Toaster />
          <FaviconUpdater />
          <CustomCodeInjector />
        </Providers>
      </body>
    </html>
  );
}
