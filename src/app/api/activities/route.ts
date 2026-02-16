import { NextResponse } from "next/server";
import { getActivities } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const activities = getActivities(user.id);
  return NextResponse.json({ activities });
}
