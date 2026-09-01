"use client";

import { useState } from "react";
import { Star, Quote, MessageSquarePlus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/lib/api-hooks";
import { useAppStore } from "@/lib/store";
import { BRAND } from "@/lib/brand";
import { relativeTime } from "@/lib/format";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReviewForm } from "./review-form";

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-slate-700"
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const initial = (review.author || "A").trim().charAt(0).toUpperCase();
  // Stable color per author
  const colors = [
    "from-cyan-500/30 to-cyan-500/10 text-cyan-200",
    "from-amber-500/30 to-amber-500/10 text-amber-200",
    "from-violet-500/30 to-violet-500/10 text-violet-200",
    "from-emerald-500/30 to-emerald-500/10 text-emerald-200",
    "from-rose-500/30 to-rose-500/10 text-rose-200",
  ];
  const colorIdx = review.author.charCodeAt(0) % colors.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="break-inside-avoid rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold ring-1 ring-border",
            colors[colorIdx]
          )}
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {review.author}
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {relativeTime(review.createdAt)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Stars value={review.rating} />
            {review.source === "google" && (
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-[10px] text-primary"
              >
                Google
              </Badge>
            )}
          </div>
        </div>
      </div>
      {review.device && (
        <div className="mt-3">
          <Badge variant="secondary" className="text-[11px]">
            {review.device}
          </Badge>
        </div>
      )}
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        <Quote className="mr-1 inline size-3 -translate-y-0.5 text-primary/60" />
        {review.comment}
      </p>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="animate-shimmer size-10 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="animate-shimmer h-3 w-1/2 rounded bg-muted" />
          <div className="animate-shimmer mt-2 h-3 w-1/3 rounded bg-muted" />
        </div>
      </div>
      <div className="animate-shimmer mt-3 h-3 w-full rounded bg-muted" />
      <div className="animate-shimmer mt-1.5 h-3 w-5/6 rounded bg-muted" />
      <div className="animate-shimmer mt-1.5 h-3 w-4/6 rounded bg-muted" />
    </div>
  );
}

export function ReviewsSection() {
  const { data: reviews, isLoading } = useReviews(true);
  const [showForm, setShowForm] = useState(false);

  const list = reviews ?? [];
  const avg =
    list.length > 0
      ? list.reduce((s, r) => s + r.rating, 0) / list.length
      : BRAND.rating;
  const count = list.length || BRAND.reviewCount;

  // Compute breakdown
  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const c = list.filter((r) => Math.round(r.rating) === star).length;
    const pct = list.length > 0 ? (c / list.length) * 100 : 0;
    return { star, count: c, pct };
  });

  return (
    <section className="relative py-12 sm:py-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            Verified Customer Reviews
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            What Our Customers Say
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Real reviews from real customers across East Kilbride. We&apos;re
            proud of our reputation — and we work hard to keep it.
          </p>
        </div>

        {/* Aggregate + breakdown */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex flex-col items-center justify-center text-center sm:pr-6 sm:border-r sm:border-border">
            <p className="text-5xl font-extrabold text-foreground">
              {avg.toFixed(1)}
            </p>
            <Stars value={avg} className="mt-1.5 [&_svg]:size-4" />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Based on {count}+ reviews
            </p>
            <Badge
              variant="outline"
              className="mt-3 border-primary/30 bg-primary/5 text-primary"
            >
              <Sparkles className="size-3" />
              Verified Google Reviews
            </Badge>
          </div>
          <div className="space-y-2">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-3">
                <span className="flex w-12 shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
                  {b.star}
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
                  {b.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit a review CTA */}
        <div className="mt-8 flex justify-center">
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
            >
              <MessageSquarePlus className="size-4 text-primary" />
              Leave a Review
            </Button>
          ) : (
            <ReviewForm onClose={() => setShowForm(false)} />
          )}
        </div>

        {/* Reviews list */}
        <div className="mt-10">
          {isLoading ? (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : list.length > 0 ? (
            <div className="max-h-[640px] overflow-y-auto custom-scroll pr-1">
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
                {list.map((r, i) => (
                  <ReviewCard key={r.id} review={r} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
              <p className="text-sm text-muted-foreground">
                No reviews yet — be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
