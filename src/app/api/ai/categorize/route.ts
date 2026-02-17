import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { categorizeDocument, isAIConfigured } from "@/lib/ai";

export async function POST(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { title, description, fileName } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Titre requis" }, { status: 400 });
  }

  const categories = getCategories().map((c) => c.name);

  try {
    const result = await categorizeDocument(title, description || "", fileName || "", categories);
    let parsed;
    try {
      parsed = JSON.parse(result.content);
    } catch {
      parsed = { category: categories[0], confidence: 0.5, alternatives: [] };
    }
    return NextResponse.json({
      ...parsed,
      model: result.model,
      configured: isAIConfigured(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur IA";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
