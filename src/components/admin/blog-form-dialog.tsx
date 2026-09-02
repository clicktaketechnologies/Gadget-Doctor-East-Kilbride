"use client";

import { useState } from "react";
import { Save, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useCreateBlogPost, useUpdateBlogPost } from "@/lib/api-hooks";
import type { BlogPost } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BLOG_CATEGORIES = [
  { value: "General", label: "General" },
  { value: "Guides", label: "Guides" },
  { value: "Repairs", label: "Repairs" },
  { value: "Tips", label: "Tips" },
  { value: "News", label: "News" },
];

interface BlogFormDialogProps {
  post: BlogPost | null; // null = create mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlogFormDialog({
  post,
  open,
  onOpenChange,
}: BlogFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Key-remount so the form's local state resets when switching between
        // posts or between create/edit modes.
        key={post?.id ?? "new"}
        className="glass-strong max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <BlogFormBody post={post} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function BlogFormBody({
  post,
  onDone,
}: {
  post: BlogPost | null;
  onDone: () => void;
}) {
  const isEdit = !!post;
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost(post?.id ?? "");

  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [category, setCategory] = useState(post?.category ?? "General");
  const [tags, setTags] = useState(post?.tags ?? "");
  const [author, setAuthor] = useState(post?.author ?? "Gadget Doctor");
  const [published, setPublished] = useState(post?.published ?? false);
  const [featured, setFeatured] = useState(post?.featured ?? false);

  const mutation = isEdit ? updateMutation : createMutation;
  const error = mutation.error?.message;

  const canSubmit =
    title.trim() !== "" &&
    excerpt.trim() !== "" &&
    content.trim() !== "" &&
    author.trim() !== "" &&
    !mutation.isPending;

  const handleSubmit = () => {
    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || undefined,
      category,
      tags: tags.trim(),
      author: author.trim(),
      published,
      featured,
    };
    if (isEdit) {
      updateMutation.mutate(payload, { onSuccess: onDone });
    } else {
      createMutation.mutate(payload, { onSuccess: onDone });
    }
  };

  return (
    <>
      <DialogHeader className="border-b border-border/60 p-5 pr-12">
        <DialogTitle>{isEdit ? "Edit blog post" : "New blog post"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the content of this post. Slug auto-generates from the title."
            : "Write a new article. You can save as draft (unpublished) or publish immediately."}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[calc(92vh-200px)] space-y-4 overflow-y-auto custom-scroll p-5">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="bf-title">Title</Label>
          <Input
            id="bf-title"
            placeholder="e.g. How to Fix a Cracked iPhone Screen"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="bf-excerpt">Excerpt</Label>
          <Textarea
            id="bf-excerpt"
            rows={2}
            placeholder="A short summary shown on the blog listing and search results."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bf-content">Content</Label>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Markdown supported
            </span>
          </div>
          <Textarea
            id="bf-content"
            rows={12}
            placeholder={`Write your post here. Markdown supported:

## Heading
- Bullet point
- Bullet point

**bold** and *italic* text.`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Use <code className="rounded bg-secondary/50 px-1">## headings</code>,{" "}
            <code className="rounded bg-secondary/50 px-1">- bullets</code>,{" "}
            <code className="rounded bg-secondary/50 px-1">**bold**</code> for
            formatting.
          </p>
        </div>

        {/* Cover image */}
        <div className="space-y-2">
          <Label htmlFor="bf-cover">Cover image URL</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <Input
              id="bf-cover"
              placeholder="https://… (leave empty for no cover)"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="flex-1"
            />
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-secondary/20">
              {coverImage.trim() ? (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <ImageIcon className="size-6 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Category + Tags */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bf-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="bf-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bf-tags">Tags</Label>
            <Input
              id="bf-tags"
              placeholder="comma, separated, tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="bf-author">Author</Label>
          <Input
            id="bf-author"
            placeholder="Author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        {/* Published + Featured */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 p-3">
            <div>
              <div className="text-sm font-medium text-foreground">Published</div>
              <div className="text-xs text-muted-foreground">
                Visible on the public blog.
              </div>
            </div>
            <Switch
              checked={published}
              onCheckedChange={setPublished}
              aria-label="Publish post"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 p-3">
            <div>
              <div className="text-sm font-medium text-foreground">Featured</div>
              <div className="text-xs text-muted-foreground">
                Highlight at the top of the blog list.
              </div>
            </div>
            <Switch
              checked={featured}
              onCheckedChange={setFeatured}
              aria-label="Mark as featured"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <DialogFooter className="border-t border-border/60 bg-secondary/20 p-4">
        <Button variant="outline" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {isEdit ? "Save changes" : "Create post"}
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export default BlogFormDialog;
