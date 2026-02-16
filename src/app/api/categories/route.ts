import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory, getDocuments, createActivity } from "@/lib/db";
import { getCurrentUser, generateId } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const cats = getCategories();
  const docs = getDocuments();

  const categoriesWithStats = cats.map((cat) => {
    const catDocs = docs.filter((d) => d.category === cat.name);
    const archivedCount = catDocs.filter((d) => d.status === "archivé").length;
    return {
      ...cat,
      count: catDocs.length,
      archivedCount,
      processingCount: catDocs.length - archivedCount,
    };
  });

  return NextResponse.json({ categories: categoriesWithStats });
}

export async function POST(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { name, icon, description } = body;

  if (!name) {
    return NextResponse.json({ error: "Nom de catégorie requis" }, { status: 400 });
  }

  const existing = getCategories().find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 409 });
  }

  const cat = createCategory({
    id: generateId(),
    name,
    icon: icon || "FolderOpen",
    description: description || "",
    createdBy: user.id,
    createdAt: new Date().toISOString(),
  });

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Catégorie créée",
    target: name,
    targetType: "category",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ category: cat }, { status: 201 });
}
