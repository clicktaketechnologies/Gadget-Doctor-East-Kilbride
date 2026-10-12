import { NextResponse } from "next/server";

// Server component — renders raw HTML (meta tags, scripts) into <head>
// This ensures the tags are in the RAW HTML source (not just client-injected),
// so Google Search Console and other crawlers can find verification tags.
export function ServerMetaTags({ html }: { html: string }) {
  // Only render meta tags and link tags (not scripts) for SSR
  // Scripts are handled by the client-side CustomCodeInjector
  const metaPattern = /<(meta|link|style)[^>]*>/gi;
  const matches = html.match(metaPattern) || [];

  if (matches.length === 0) return null;

  // Render each tag using dangerouslySetInnerHTML
  return (
    <>
      {matches.map((tag, i) => (
        <span
          key={i}
          dangerouslySetInnerHTML={{ __html: tag }}
        />
      ))}
    </>
  );
}
