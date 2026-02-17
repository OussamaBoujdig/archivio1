import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser, createSubscription } from "@/lib/db";
import { hashPassword, generateId, createUserSession, setSessionCookie } from "@/lib/auth";
import { createActivity, createNotification } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export async function POST(req: NextRequest) {
  seedDatabase();

  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nom, email et mot de passe requis" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 409 });
  }

  const userId = generateId();
  const user = createUser({
    id: userId,
    name,
    email,
    passwordHash: hashPassword(password),
    role: "user",
    organization: "",
    bio: "",
    createdAt: new Date().toISOString(),
  });

  const token = createUserSession(userId);
  await setSessionCookie(token);

  createActivity({
    id: generateId(),
    userId,
    action: "Inscription",
    target: "Nouveau compte créé",
    targetType: "user",
    createdAt: new Date().toISOString(),
  });

  createNotification({
    id: generateId(),
    userId,
    title: "Bienvenue !",
    message: "Bienvenue sur Archivist. Commencez par importer vos premiers documents.",
    read: false,
    createdAt: new Date().toISOString(),
  });

  // Create default free subscription
  const now = new Date();
  createSubscription({
    id: generateId(),
    userId,
    planId: "starter",
    status: "active",
    billingCycle: "monthly",
    stripeCustomerId: "",
    stripeSubscriptionId: "",
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: new Date(now.getTime() + 30 * 86400000).toISOString(),
    cancelAtPeriodEnd: false,
    trialEnd: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, organization: user.organization },
  });
}
