import { NextRequest, NextResponse } from "next/server";
import { getDocumentById, updateDocument, deleteDocument, createActivity, createNotification } from "@/lib/db";
import { getCurrentUser, generateId } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const doc = getDocumentById(id);
  if (!doc) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  return NextResponse.json({ document: doc });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const doc = updateDocument(id, body);

  if (!doc) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Document modifié",
    target: doc.title,
    targetType: "document",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ document: doc });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const doc = getDocumentById(id);
  if (!doc) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  deleteDocument(id);

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Document supprimé",
    target: doc.title,
    targetType: "document",
    createdAt: new Date().toISOString(),
  });

  createNotification({
    id: generateId(),
    userId: user.id,
    title: "Document supprimé",
    message: `Le document "${doc.title}" a été supprimé.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
