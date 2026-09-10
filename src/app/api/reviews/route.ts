import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import { setCorsHeaders, handlePreflight } from "@/lib/cors";
import type { CreateReviewInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req) ?? new NextResponse(null, { status: 204 });
}

// GET /api/reviews?approved=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const approvedOnly = searchParams.get("approved") === "true";

  const reviews = await db.review.findMany({
    where: approvedOnly ? { approved: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return setCorsHeaders(req, NextResponse.json(reviews));
}

// POST /api/reviews  (public can submit, auto-approved for demo)
export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateReviewInput;
  if (!body.author || !body.comment || !body.rating) {
    return setCorsHeaders(req, NextResponse.json({ error: "Missing fields" }, { status: 400 }));
  }
  const review = await db.review.create({
    data: {
      author: body.author,
      rating: Math.max(1, Math.min(5, Number(body.rating))),
      comment: body.comment,
      device: body.device || null,
      source: "Google",
      approved: true,
    },
  });
  return setCorsHeaders(req, NextResponse.json(review, { status: 201 }));
}
