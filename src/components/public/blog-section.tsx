"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Sparkles,
  PenSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useBlogPosts } from "@/lib/api-hooks";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CtaBand } from "./cta-band";

const FILTERS = ["All", "Guides", "Repairs", "Tips", "News"] as const;
type Filter = (typeof FILTERS)[number];

function parseTags(post: BlogPost): string[] {
  if (!post.tags) return [];
  return post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function matchesFilter(post: BlogPost, filter: Filter): boolean {
  if (filter === "All") return true;
  const cat = post.category?.toLowerCase() ?? "";
  return (
    cat === filter.toLowerCase().slice(0, -1) ||
    cat.includes(filter.toLowerCase()) ||
    parseTags(post).some((t) =>
      t.toLowerCase().includes(filter.toLowerCase().slice(0, -1))
    )
  );
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function PostCover({
  post,
  className,
  rounded = "rounded-xl",
}: {
  post: BlogPost;
  className?: string;
  rounded?: string;
}) {
  if (post.coverImage) {
    return (
      <img
        src={post.coverImage}
        alt={post.title}
        loading="lazy"
        className={cn("h-full w-full object-cover", rounded, className)}
      />
    );
  }
  // Gradient placeholder using the post slug for a stable hue
  const hue =
    Array.from(post.slug).reduce((s, c) => s + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/15 to-card text-primary/40",
        rounded,
        className
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hue} 70% 35% / 0.35), hsl(${
          (hue + 60) % 360
        } 70% 40% / 0.25))`,
      }}
    >
      <PenSquare className="size-7" />
    </div>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  const openBlogDetail = useAppStore((s) => s.openBlogDetail);
  const tags = parseTags(post);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-card shadow-xl shadow-primary/5"
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <button
          onClick={() => {
            openBlogDetail(post.slug);
            if (typeof window !== "undefined")
              window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto"
          aria-label={`Read featured article: ${post.title}`}
        >
          <PostCover
            post={post}
            rounded="rounded-none"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/30">
            <Sparkles className="size-3" />
            Featured
          </span>
        </button>
        <div className="flex flex-col justify-center p-6 sm:p-8">
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
              {estimateReadTime(post.content)} min read
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {post.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {post.excerpt}
          </p>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  <Tag className="size-2.5" />
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="size-3.5 text-primary" />
              {post.author || "Gadget Doctor"}
            </span>
            <Button
              onClick={() => {
                openBlogDetail(post.slug);
                if (typeof window !== "undefined")
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
            >
              Read article
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const openBlogDetail = useAppStore((s) => s.openBlogDetail);
  const tags = parseTags(post);
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <button
        onClick={() => {
          openBlogDetail(post.slug);
          if (typeof window !== "undefined")
            window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="relative aspect-[16/9] w-full overflow-hidden"
        aria-label={`Read article: ${post.title}`}
      >
        <PostCover
          post={post}
          rounded="rounded-none"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {post.category && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
            {post.category}
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Calendar className="size-3" />
          {formatDate(post.createdAt)}
          <span className="mx-0.5">·</span>
          <Clock className="size-3" />
          {estimateReadTime(post.content)} min
        </div>
        <h3 className="mt-2 text-base font-bold leading-snug text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            openBlogDetail(post.slug);
            if (typeof window !== "undefined")
              window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:gap-1.5"
        >
          Read more
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </motion.article>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="animate-shimmer aspect-[16/9] w-full bg-muted" />
      <div className="p-5">
        <div className="animate-shimmer h-3 w-1/3 rounded bg-muted" />
        <div className="animate-shimmer mt-3 h-4 w-3/4 rounded bg-muted" />
        <div className="animate-shimmer mt-2 h-3 w-full rounded bg-muted" />
        <div className="animate-shimmer mt-1.5 h-3 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}

export function BlogSection() {
  const { data: posts, isLoading } = useBlogPosts(true);
  const [filter, setFilter] = useState<Filter>("All");

  const featured = useMemo(
    () => (posts ?? []).find((p) => p.featured) ?? null,
    [posts]
  );

  const gridPosts = useMemo(() => {
    const all = posts ?? [];
    const list = featured ? all.filter((p) => p.id !== featured.id) : all;
    return list.filter((p) => matchesFilter(p, filter));
  }, [posts, featured, filter]);

  return (
    <section className="relative py-12 sm:py-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <PenSquare className="size-3.5" />
            Gadget Doctor Blog
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Repair Tips, Guides &amp;{" "}
            <span className="text-gradient-cyan">News</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Practical advice, step-by-step guides and workshop news from our
            East Kilbride technicians.
          </p>
        </div>

        {/* Featured */}
        {isLoading ? (
          <div className="mt-10 animate-shimmer h-72 rounded-3xl bg-muted" />
        ) : (
          featured &&
          filter === "All" && (
            <div className="mt-10">
              <FeaturedPost post={featured} />
            </div>
          )
        )}

        {/* Filter chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                  active
                    ? "border-primary/60 bg-primary/15 text-primary shadow-sm shadow-primary/20"
                    : "border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            : gridPosts.map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
        </div>

        {!isLoading && gridPosts.length === 0 && (
          <div className="mt-12 rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
              <PenSquare className="size-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No articles in this category yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon — we publish new repair guides every week.
            </p>
          </div>
        )}
      </div>

      <CtaBand
        title="Need a repair?"
        subtitle="Our East Kilbride workshop fixes phones, tablets, laptops, MacBooks, computers, custom PCs, consoles and Apple Watches — same-day service, 12-month warranty."
        bookLabel="Book Your Repair"
      />
    </section>
  );
}

export default BlogSection;
