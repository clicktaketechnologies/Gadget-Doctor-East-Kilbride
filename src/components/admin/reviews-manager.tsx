"use client";

import { useState } from "react";
import { Star, Pencil, Trash2, Loader2, Save } from "lucide-react";
import { useReviews, useUpdateReview, useDeleteReview } from "@/lib/api-hooks";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ReviewsManager() {
  const reviewsQ = useReviews();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);

  const openEdit = (r: Review) => {
    setEditing(r);
    setEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Customer Reviews</h2>
        <p className="text-sm text-muted-foreground">
          {reviewsQ.isLoading
            ? "Loading…"
            : `${reviewsQ.data?.length ?? 0} reviews · ${
                reviewsQ.data?.filter((r) => r.approved).length ?? 0
              } approved`}
        </p>
      </div>

      <Card className="glass p-0">
        <div className="overflow-x-auto custom-scroll">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="pl-4">Author</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="max-w-[300px]">Comment</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-center">Approved</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewsQ.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-border/60">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-4" : ""}>
                        <Skeleton className="h-5 w-full max-w-[120px] rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (reviewsQ.data ?? []).length === 0 ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell colSpan={7} className="h-40 text-center text-sm text-muted-foreground">
                    No reviews yet.
                  </TableCell>
                </TableRow>
              ) : (
                (reviewsQ.data ?? []).map((r) => (
                  <ReviewRow key={r.id} review={r} onEdit={openEdit} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ReviewEditDialog
        review={editing}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}

function ReviewRow({
  review,
  onEdit,
}: {
  review: Review;
  onEdit: (r: Review) => void;
}) {
  const initials = review.author
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <TableRow className="border-border/60">
      <TableCell className="pl-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary ring-1 ring-primary/30">
            {initials || "?"}
          </div>
          <span className="text-sm font-medium text-foreground">{review.author}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-foreground">{review.rating}</span>
        </div>
      </TableCell>
      <TableCell className="max-w-[300px]">
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {review.comment}
        </span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {review.device ?? "—"}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="border-border/60 text-muted-foreground">
          {review.source}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <ApproveToggle review={review} />
      </TableCell>
      <TableCell className="pr-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onEdit(review)}
            aria-label={`Edit review by ${review.author}`}
          >
            <Pencil className="size-4" />
          </Button>
          <DeleteReviewButton review={review} />
        </div>
      </TableCell>
    </TableRow>
  );
}

function ApproveToggle({ review }: { review: Review }) {
  const updateMutation = useUpdateReview(review.id);
  return (
    <div className="flex justify-center">
      <Switch
        checked={review.approved}
        disabled={updateMutation.isPending}
        onCheckedChange={(v) => updateMutation.mutate({ approved: v })}
        aria-label={`Toggle approval for review by ${review.author}`}
      />
    </div>
  );
}

function DeleteReviewButton({ review }: { review: Review }) {
  const deleteMutation = useDeleteReview();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          disabled={deleteMutation.isPending}
          aria-label={`Delete review by ${review.author}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this review?</AlertDialogTitle>
          <AlertDialogDescription>
            The review by <strong>{review.author}</strong> will be permanently
            removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate(review.id)}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete review"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ReviewEditDialog({
  review,
  open,
  onOpenChange,
}: {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        key={review?.id ?? "none"}
        className="glass-strong max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        {review && <ReviewEditBody review={review} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function ReviewEditBody({
  review,
  onDone,
}: {
  review: Review;
  onDone: () => void;
}) {
  const updateMutation = useUpdateReview(review.id);
  const [author, setAuthor] = useState(review.author);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [device, setDevice] = useState(review.device ?? "");

  const canSubmit =
    author.trim() !== "" && comment.trim() !== "" && !updateMutation.isPending;

  const handleSave = () => {
    updateMutation.mutate(
      {
        author: author.trim(),
        rating,
        comment: comment.trim(),
        device: device.trim() || undefined,
      },
      { onSuccess: onDone }
    );
  };

  return (
    <>
      <DialogHeader className="border-b border-border/60 p-5 pr-12">
        <DialogTitle>Edit review</DialogTitle>
        <DialogDescription>
          Update the review details below.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="rv-author">Author name</Label>
          <Input
            id="rv-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Rating</Label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`Set rating to ${n} star${n > 1 ? "s" : ""}`}
                className="rounded p-1 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Star
                  className={cn(
                    "size-6 transition-colors",
                    n <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-muted-foreground"
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-medium text-foreground">{rating}/5</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rv-comment">Comment</Label>
          <Textarea
            id="rv-comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rv-device">Device (optional)</Label>
          <Input
            id="rv-device"
            placeholder="e.g. iPhone 13"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="border-t border-border/60 bg-secondary/20 p-4">
        <Button variant="outline" onClick={onDone} disabled={updateMutation.isPending}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!canSubmit}>
          {updateMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save changes
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export default ReviewsManager;
