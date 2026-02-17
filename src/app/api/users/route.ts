import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser, createActivity, createNotification } from "@/lib/db";
import { getCurrentUser, generateId, hashPassword } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const users = getUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    organization: u.organization,
    createdAt: u.createdAt,
  }));

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nom, email et mot de passe requis" }, { status: 400 });
  }

  const { getUserByEmail } = await import("@/lib/db");
  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 409 });
  }

  const newUserId = generateId();
  const newUser = createUser({
    id: newUserId,
    name,
    email,
    passwordHash: hashPassword(password),
    role: role === "admin" ? "admin" : "employé",
    organization: user.organization || "",
    bio: "",
    createdAt: new Date().toISOString(),
  });

  createActivity({
    id: generateId(),
    userId: user.id,
    action: "Utilisateur créé",
    target: `${name} (${role === "admin" ? "Admin" : "Employé"})`,
    targetType: "user",
    createdAt: new Date().toISOString(),
  });

  createNotification({
    id: generateId(),
    userId: newUserId,
    title: "Bienvenue !",
    message: `Votre compte a été créé par ${user.name}. Bienvenue sur Archivist.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  }, { status: 201 });
}
