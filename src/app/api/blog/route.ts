import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { CreateBlogPostInput } from "@/lib/types";

// GET /api/blog?published=true (public) | default (admin: all)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const publishedOnly = searchParams.get("published") === "true";

  const posts = await db.blogPost.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(posts);
}

// POST /api/blog (admin)
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as CreateBlogPostInput;
  const slug =
    body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6);

  const post = await db.blogPost.create({
    data: {
      slug,
      title: body.title,
      excerpt: body.excerpt || "",
      content: body.content || "",
      coverImage: body.coverImage || null,
      category: body.category || "General",
      tags: body.tags || "",
      author: body.author || "Gadget Doctor",
      published: body.published ?? false,
      featured: body.featured ?? false,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
