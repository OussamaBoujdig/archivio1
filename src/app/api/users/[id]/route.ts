import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, createActivity } from "@/lib/db";
import { getCurrentUser, generateId } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { role } = body;

  if (id === user.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas modifier votre propre rôle" }, { status: 400 });
  }

  const target = getUserById(id);
  if (!target) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const updated = updateUser(id, { role });

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Rôle modifié",
    target: `${target.name} → ${role}`,
    targetType: "user",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    user: { id: updated!.id, name: updated!.name, email: updated!.email, role: updated!.role },
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;

  if (id === user.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
  }

  const target = getUserById(id);
  if (!target) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Remove user from users.json
  const { getUsers } = await import("@/lib/db");
  const fs = await import("fs");
  const path = await import("path");
  const users = getUsers().filter((u) => u.id !== id);
  const DATA_DIR = path.join(process.cwd(), "data");
  fs.writeFileSync(path.join(DATA_DIR, "users.json"), JSON.stringify(users, null, 2));

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Utilisateur supprimé",
    target: target.name,
    targetType: "user",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
