import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";
import { chat, isAIConfigured } from "@/lib/ai";
import type { ChatMessage } from "@/lib/ai";

export async function POST(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Messages requis" }, { status: 400 });
  }

  try {
    const result = await chat(messages as ChatMessage[]);
    return NextResponse.json({
      message: result.content,
      model: result.model,
      usage: result.usage,
      configured: isAIConfigured(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur IA";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
