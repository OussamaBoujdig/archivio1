import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const stats = getDashboardStats();
  return NextResponse.json(stats);
}
