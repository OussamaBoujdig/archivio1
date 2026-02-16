import { NextRequest, NextResponse } from "next/server";
import { getDocuments, createDocument, searchDocuments, createActivity, createNotification } from "@/lib/db";
import { getCurrentUser, generateId } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  const docs = query || category || status
    ? searchDocuments(query, category || undefined, status || undefined)
    : getDocuments();

  return NextResponse.json({ documents: docs });
}

export async function POST(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { title, category, type, tags, description, fileName, size, sizeBytes } = body;

  if (!title || !category) {
    return NextResponse.json({ error: "Titre et catégorie requis" }, { status: 400 });
  }

  const docId = generateId();
  const doc = createDocument({
    id: docId,
    title,
    category,
    type: type || "PDF",
    size: size || "0 KB",
    sizeBytes: sizeBytes || 0,
    status: "en traitement",
    date: new Date().toISOString().split("T")[0],
    tags: tags || [],
    description: description || "",
    fileName: fileName || `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
    uploadedBy: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Document importé",
    target: title,
    targetType: "document",
    createdAt: new Date().toISOString(),
  });

  createNotification({
    id: generateId(),
    userId: user.id,
    title: "Document importé",
    message: `Le document "${title}" a été importé avec succès.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ document: doc }, { status: 201 });
}
