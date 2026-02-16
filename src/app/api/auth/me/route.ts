import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      bio: user.bio,
      createdAt: user.createdAt,
    },
  });
}
