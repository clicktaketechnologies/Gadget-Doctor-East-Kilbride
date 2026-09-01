import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { CreateServiceInput } from "@/lib/types";

// GET /api/services?active=true   (public)  |  default (admin: all)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";

  const services = await db.service.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: [{ category: "asc" }, { priceFrom: "asc" }],
  });
  return NextResponse.json(services);
}

// POST /api/services  (admin)
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  return NextResponse.json(svc, { status: 201 });
}
