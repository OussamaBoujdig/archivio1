import { NextRequest, NextResponse } from "next/server";
import { getCategoryById, updateCategory, deleteCategory, createActivity } from "@/lib/db";
import { getCurrentUser, generateId } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const cat = updateCategory(id, body);

  if (!cat) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Catégorie modifiée",
    target: cat.name,
    targetType: "category",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ category: cat });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const cat = getCategoryById(id);
  if (!cat) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }

  deleteCategory(id);

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Catégorie supprimée",
    target: cat.name,
    targetType: "category",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
