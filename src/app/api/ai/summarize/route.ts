import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDocumentById } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { summarizeDocument, isAIConfigured } from "@/lib/ai";

export async function POST(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { documentId } = await req.json();

  if (!documentId) {
    return NextResponse.json({ error: "ID du document requis" }, { status: 400 });
  }

  const doc = getDocumentById(documentId);
  if (!doc) {
    return NextResponse.json({ error: "Document non trouvé" }, { status: 404 });
  }

  try {
    const result = await summarizeDocument(doc.title, doc.description, doc.category, doc.tags);
    return NextResponse.json({
      summary: result.content,
      model: result.model,
      configured: isAIConfigured(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur IA";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
