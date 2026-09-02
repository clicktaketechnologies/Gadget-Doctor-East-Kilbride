"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Loader2,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { useBlogPosts, useUpdateBlogPost, useDeleteBlogPost } from "@/lib/api-hooks";
import { relativeTime } from "@/lib/format";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { BlogFormDialog } from "./blog-form-dialog";

const CATEGORY_STYLES: Record<string, string> = {
  General: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Guides: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Repairs: "bg-primary/15 text-primary border-primary/30",
  Tips: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  News: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export function BlogManager() {
  const blogQ = useBlogPosts(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setFormOpen(true);
  };

  const posts = blogQ.data ?? [];
  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Blog Posts</h2>
          <p className="text-sm text-muted-foreground">
            {blogQ.isLoading
              ? "Loading…"
              : `${posts.length} posts · ${publishedCount} published · ${posts.length - publishedCount} draft${posts.length - publishedCount === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          New Post
        </Button>
      </div>

      {/* Table */}
      <Card className="glass p-0">
        <div className="overflow-x-auto custom-scroll">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="pl-4">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-center">Published</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogQ.isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/60">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-4" : j === 7 ? "pr-4" : ""}>
                        <Skeleton className="h-5 w-full max-w-[120px] rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : posts.length === 0 ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell colSpan={8} className="h-40 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="size-8 text-muted-foreground/50" />
                      <div>
                        No blog posts yet. Click{" "}
                        <span className="font-medium text-foreground">New Post</span>{" "}
                        to write your first article.
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <BlogRow key={post.id} post={post} onEdit={openEdit} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <BlogFormDialog
        post={editing}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  );
}

function BlogRow({
  post,
  onEdit,
}: {
  post: BlogPost;
  onEdit: (p: BlogPost) => void;
}) {
  return (
    <TableRow className="border-border/60">
      <TableCell className="pl-4">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-secondary/20">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt=""
              className="size-full object-cover"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.style.display = "none";
                if (t.nextElementSibling) {
                  (t.nextElementSibling as HTMLElement).style.display = "flex";
                }
              }}
            />
          ) : (
            <ImageIcon className="size-4 text-muted-foreground" />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-xs">
          <div className="truncate text-sm font-medium text-foreground">
            {post.title}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            /{post.slug}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "border",
            CATEGORY_STYLES[post.category] ??
              "bg-slate-500/15 text-slate-300 border-slate-500/30"
          )}
        >
          {post.category}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {post.author}
      </TableCell>
      <TableCell className="text-center">
        <PublishedToggle post={post} />
      </TableCell>
      <TableCell className="text-center">
        <FeaturedToggle post={post} />
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {relativeTime(post.createdAt)}
      </TableCell>
      <TableCell className="pr-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onEdit(post)}
            aria-label={`Edit ${post.title}`}
          >
            <Pencil className="size-4" />
          </Button>
          <DeletePostButton post={post} />
        </div>
      </TableCell>
    </TableRow>
  );
}

function PublishedToggle({ post }: { post: BlogPost }) {
  const updateMutation = useUpdateBlogPost(post.id);
  return (
    <div className="flex justify-center">
      <Switch
        checked={post.published}
        disabled={updateMutation.isPending}
        onCheckedChange={(v) => updateMutation.mutate({ published: v })}
        aria-label={`Toggle published for ${post.title}`}
      />
    </div>
  );
}

function FeaturedToggle({ post }: { post: BlogPost }) {
  const updateMutation = useUpdateBlogPost(post.id);
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => updateMutation.mutate({ featured: !post.featured })}
        disabled={updateMutation.isPending}
        aria-label={`Toggle featured for ${post.title}`}
        aria-pressed={post.featured}
        className="rounded-full p-1 transition-colors hover:bg-amber-500/10 disabled:opacity-50"
      >
        <Star
          className={cn(
            "size-4 transition-colors",
            post.featured
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground"
          )}
        />
      </button>
    </div>
  );
}

function DeletePostButton({ post }: { post: BlogPost }) {
  const deleteMutation = useDeleteBlogPost();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          disabled={deleteMutation.isPending}
          aria-label={`Delete ${post.title}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this blog post?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{post.title}</strong> will be permanently removed. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate(post.id)}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete post"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BlogManager;
