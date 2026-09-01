import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { DashboardStats } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await db.booking.findMany();

  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const inProgress = bookings.filter((b) => b.status === "In Progress").length;
  const ready = bookings.filter((b) => b.status === "Ready").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const collectionPending = bookings.filter(
    (b) => b.needsCollection && b.status !== "Completed" && b.status !== "Cancelled"
  ).length;

  const revenue = bookings
    .filter((b) => b.status === "Completed" || b.status === "Ready")
    .reduce((sum, b) => sum + (b.finalPrice ?? b.quotedPrice ?? 0), 0);

  const revenueCompleted = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + (b.finalPrice ?? b.quotedPrice ?? 0), 0);

  const now = new Date();
  const trend: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const count = bookings.filter(
      (b) => new Date(b.createdAt).toISOString().slice(0, 10) === dayStr
    ).length;
    trend.push({ date: dayStr, count });
  }

  const deviceMap = new Map<string, number>();
  for (const b of bookings) {
    deviceMap.set(b.deviceType, (deviceMap.get(b.deviceType) ?? 0) + 1);
  }
  const deviceBreakdown = Array.from(deviceMap.entries())
    .map(([deviceType, count]) => ({ deviceType, count }))
    .sort((a, b) => b.count - a.count);

  const stats: DashboardStats = {
    total,
    pending,
    inProgress,
    ready,
    completed,
    collectionPending,
    revenue,
    revenueCompleted,
    statusTrend: trend,
    deviceBreakdown,
  };

  return NextResponse.json(stats);
}
