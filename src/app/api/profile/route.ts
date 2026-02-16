import { NextRequest, NextResponse } from "next/server";
import { updateUser, createActivity } from "@/lib/db";
import { getCurrentUser, generateId } from "@/lib/auth";
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

export async function PUT(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, bio, organization } = body;

  const updated = updateUser(user.id, {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(bio !== undefined && { bio }),
    ...(organization !== undefined && { organization }),
  });

  if (!updated) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Profil mis à jour",
    target: "Informations personnelles",
    targetType: "user",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      organization: updated.organization,
      bio: updated.bio,
      createdAt: updated.createdAt,
    },
  });
}
