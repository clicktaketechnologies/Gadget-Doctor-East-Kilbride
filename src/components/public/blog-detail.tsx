"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Tag,
  PenSquare,
  Facebook,
  Twitter,
  Link2,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useBlogPosts } from "@/lib/api-hooks";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/lib/types";
import { CtaBand } from "./cta-band";

/* ----------------------- Minimal markdown renderer ---------------------- */

interface Block {
  type: "p" | "h2" | "h3" | "ul" | "ol";
  text?: string;
  items?: string[];
}

function parseInline(text: string): React.ReactNode {
  // Handle **bold**, *italic*, `code`, [link](url)
  const nodes: React.ReactNode[] = [];
  // Bold + italic + code + links — split on a combined regex
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const tok = match[0];
    if (tok.startsWith("**") && tok.endsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (tok.startsWith("*") && tok.endsWith("*")) {
      nodes.push(
        <em key={key++} className="italic">
          {tok.slice(1, -1)}
        </em>
      );
    } else if (tok.startsWith("`") && tok.endsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
        >
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      if (m) {
        nodes.push(
          <a
            key={key++}
            href={m[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            {m[1]}
          </a>
        );
      } else {
        nodes.push(tok);
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return <>{nodes}</>;
}

function parseContent(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i++;
      continue;
    }
    // Heading
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4) });
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3) });
      i++;
      continue;
    }
    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    // Paragraph (consume until blank line)
    const para: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", text: para.join(" ") });
  }
  return blocks;
}

function PostContent({ content }: { content: string }) {
  const blocks = useMemo(() => parseContent(content), [content]);
  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-foreground/90">
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <h2
              key={i}
              className="mt-8 text-2xl font-bold tracking-tight text-foreground"
            >
              {b.text}
            </h2>
          );
        }
        if (b.type === "h3") {
          return (
            <h3
              key={i}
              className="mt-6 text-lg font-bold tracking-tight text-foreground"
            >
              {b.text}
            </h3>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="space-y-2">
              {b.items!.map((it, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{parseInline(it)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol key={i} className="space-y-2">
              {b.items!.map((it, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {j + 1}
                  </span>
                  <span>{parseInline(it)}</span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="text-foreground/90">
            {parseInline(b.text!)}
          </p>
        );
      })}
    </div>
  );
}

/* ------------------------------ Related card ---------------------------- */

function RelatedCard({ post }: { post: BlogPost }) {
  const openBlogDetail = useAppStore((s) => s.openBlogDetail);
  return (
    <button
      onClick={() => {
        openBlogDetail(post.slug);
        if (typeof window !== "undefined")
          window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/15 to-card text-primary/40">
            <PenSquare className="size-6" />
          </div>
        )}
        {post.category && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
            {post.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] text-muted-foreground">
          {formatDate(post.createdAt)} · {Math.max(1, Math.round(post.content.trim().split(/\s+/).length / 220))} min
        </p>
        <h4 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-foreground">
          {post.title}
        </h4>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          Read more
          <ArrowRight className="size-3" />
        </span>
      </div>
    </button>
  );
}

/* ------------------------------ Share buttons --------------------------- */

function ShareRow({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/?blog=${encodeURIComponent(slug)}`
      : `/?blog=${encodeURIComponent(slug)}`;
  const share = (kind: "facebook" | "twitter") => {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const href =
      kind === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${u}`
        : `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
    }
  };
  const copy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // noop
    }
  };
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Share:</span>
      <button
        onClick={() => share("facebook")}
        aria-label="Share on Facebook"
        className="grid size-8 place-items-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
      >
        <Facebook className="size-3.5" />
      </button>
      <button
        onClick={() => share("twitter")}
        aria-label="Share on Twitter / X"
        className="grid size-8 place-items-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
      >
        <Twitter className="size-3.5" />
      </button>
      <button
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-400" />
            Copied
          </>
        ) : (
          <>
            <Link2 className="size-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}

/* ------------------------------ Main page ------------------------------- */

export function BlogDetail() {
  const activeBlogSlug = useAppStore((s) => s.activeBlogSlug);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  const { data: posts, isLoading } = useBlogPosts(true);

  const post = useMemo(
    () => (posts ?? []).find((p) => p.slug === activeBlogSlug) ?? null,
    [posts, activeBlogSlug]
  );

  const related = useMemo(() => {
    if (!posts || !post) return [];
    const same = posts.filter(
      (p) => p.id !== post.id && p.category === post.category
    );
    const others = posts.filter(
      (p) => p.id !== post.id && p.category !== post.category
    );
    return [...same, ...others].slice(0, 3);
  }, [posts, post]);

  if (isLoading) {
    return (
      <section className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="animate-shimmer h-6 w-32 rounded bg-muted" />
          <div className="animate-shimmer mt-6 h-8 w-3/4 rounded bg-muted" />
          <div className="animate-shimmer mt-3 h-4 w-1/2 rounded bg-muted" />
          <div className="animate-shimmer mt-8 aspect-[16/9] w-full rounded-2xl bg-muted" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-shimmer h-4 w-full rounded bg-muted"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="relative py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <PenSquare className="size-7" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground">
            Post not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find that article. It may have been moved or
            unpublished.
          </p>
          <Button
            onClick={() => setPublicPage("blog")}
            className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Button>
        </div>
      </section>
    );
  }

  const tags = post.tags
    ? post.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const readTime = Math.max(
    1,
    Math.round(post.content.trim().split(/\s+/).length / 220)
  );

  return (
    <article className="relative py-8 sm:py-12">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => {
            setPublicPage("blog");
            if (typeof window !== "undefined")
              window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to blog
        </button>

        {/* Header */}
        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {post.category && (
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary"
              >
                {post.category}
              </Badge>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" />
              {formatDate(post.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {readTime} min read
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              {post.author || "Gadget Doctor"}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-6 overflow-hidden rounded-2xl border border-border"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <div className="mt-8 border-y border-border py-8">
          <PostContent content={post.content} />
        </div>

        {/* Tags + share */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          {tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  <Tag className="size-2.5" />
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}
          <ShareRow slug={post.slug} title={post.title} />
        </div>

        {/* Author box */}
        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center">
          <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Sparkles className="size-7" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Written by
            </p>
            <h3 className="mt-1 text-base font-bold text-foreground">
              {post.author || "Gadget Doctor East Kilbride"}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              East Kilbride&apos;s trusted electronics repair workshop — 12+
              years fixing phones, tablets, laptops, MacBooks, computers,
              custom PCs, consoles and Apple Watches with a 12-month warranty
              on every repair.
            </p>
            <button
              onClick={() => {
                setPublicPage("services");
                if (typeof window !== "undefined")
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Browse our services
              <ArrowRight className="size-3.5" />
            </button>
          </div>
          <span className="hidden shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
            <ShieldCheck className="mr-1 size-3.5" />
            Certified technicians
          </span>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Related articles
              </h2>
              <button
                onClick={() => {
                  setPublicPage("blog");
                  if (typeof window !== "undefined")
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                View all
                <ArrowRight className="size-3.5" />
              </button>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <CtaBand
        title="Got a gadget that needs fixing?"
        subtitle="Our certified East Kilbride technicians can help — same-day service, genuine-grade parts and a 12-month warranty on every repair."
        bookLabel="Book Your Repair"
      />
    </article>
  );
}

export default BlogDetail;
