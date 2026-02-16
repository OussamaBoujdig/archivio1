import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword, createUserSession, setSessionCookie } from "@/lib/auth";
import { createActivity } from "@/lib/db";
import { generateId } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function POST(req: NextRequest) {
  seedDatabase();

  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  const token = createUserSession(user.id);
  await setSessionCookie(token);

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Connexion",
    target: "Session démarrée",
    targetType: "user",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, organization: user.organization },
  });
}
