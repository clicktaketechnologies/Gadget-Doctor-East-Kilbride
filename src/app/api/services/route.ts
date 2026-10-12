import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import { setCorsHeaders, handlePreflight } from "@/lib/cors";
import type { CreateServiceInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req) ?? new NextResponse(null, { status: 204 });
}

// GET /api/services?active=true   (public)  |  default (admin: all)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";

  const services = await db.service.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: [{ category: "asc" }, { priceFrom: "asc" }],
  });
  return setCorsHeaders(req, NextResponse.json(services));
}

// POST /api/services  (admin)
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return setCorsHeaders(req, NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  const body = (await req.json()) as CreateServiceInput;
  const slug =
    body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6);

  const svc = await db.service.create({
    data: {
      slug,
      name: body.name,
      category: body.category,
      description: body.description,
      icon: body.icon || "Wrench",
      priceFrom: body.priceFrom,
      priceTo: body.priceTo,
      turnaround: body.turnaround,
      popular: body.popular ?? false,
      active: true,
    },
  });
  return setCorsHeaders(req, NextResponse.json(svc, { status: 201 }));
}
