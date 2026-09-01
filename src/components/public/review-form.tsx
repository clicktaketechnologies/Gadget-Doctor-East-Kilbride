"use client";

import { useState } from "react";
import { Star, Send, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/lib/api-hooks";
import { cn } from "@/lib/utils";

const DEVICES = [
  "iPhone",
  "Samsung Phone",
  "Google Pixel",
  "MacBook",
  "Laptop",
  "PlayStation",
  "Xbox",
  "Nintendo Switch",
  "GHD",
  "Other",
];

export function ReviewForm({ onClose }: { onClose?: () => void }) {
  const mutation = useCreateReview();
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [device, setDevice] = useState("");
  const [comment, setComment] = useState("");

  const submitted = mutation.isSuccess;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim() || mutation.isPending) return;
    mutation.mutate(
      {
        author: author.trim(),
        rating,
        comment: comment.trim(),
        device: device.trim() || undefined,
      },
      {
        onSuccess: () => {
          // Reset fields for next time the form is reopened
          setAuthor("");
          setRating(5);
          setDevice("");
          setComment("");
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="mt-3 text-base font-bold text-foreground">
          Thanks for your review!
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          It&apos;s now live on our reviews page. We appreciate you taking the
          time to share your experience.
        </p>
        <Button
          onClick={onClose}
          variant="outline"
          className="mt-4 border-primary/30 bg-background/40 text-foreground hover:border-primary/60"
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Leave a Review
          </h3>
          <p className="text-xs text-muted-foreground">
            Tell others about your experience — it really helps us.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close review form"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-4">
        {/* Rating */}
        <div>
          <Label className="mb-2">Your Rating</Label>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const val = i + 1;
              const active = val <= (hover || rating);
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRating(val)}
                  onMouseEnter={() => setHover(val)}
                  onMouseLeave={() => setHover(0)}
                  className="rounded-md p-1 transition-transform hover:scale-110"
                  aria-label={`Rate ${val} out of 5 stars`}
                >
                  <Star
                    className={cn(
                      "size-6 transition-colors",
                      active
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-slate-700"
                    )}
                  />
                </button>
              );
            })}
            <span className="ml-2 text-sm font-medium text-foreground">
              {rating}/5
            </span>
          </div>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="rev-author" className="mb-1.5">
            Your Name <span className="text-rose-400">*</span>
          </Label>
          <Input
            id="rev-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Sarah M."
            required
            maxLength={80}
          />
        </div>

        {/* Device */}
        <div>
          <Label htmlFor="rev-device" className="mb-1.5">
            Device (optional)
          </Label>
          <Input
            id="rev-device"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            placeholder="e.g. iPhone 13"
            list="device-list"
            maxLength={80}
          />
          <datalist id="device-list">
            {DEVICES.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>

        {/* Comment */}
        <div>
          <Label htmlFor="rev-comment" className="mb-1.5">
            Your Review <span className="text-rose-400">*</span>
          </Label>
          <Textarea
            id="rev-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us how your repair went…"
            required
            minLength={10}
            maxLength={600}
            className="min-h-24"
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">
            {comment.length}/600
          </p>
        </div>
      </div>

      {mutation.isError && (
        <p className="mt-3 text-sm text-rose-400">
          Something went wrong. Please try again.
        </p>
      )}

      <Button
        type="submit"
        disabled={mutation.isPending || !author.trim() || !comment.trim()}
        className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
      >
        {mutation.isPending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Submit Review
          </>
        )}
      </Button>
    </form>
  );
}

export default ReviewForm;
