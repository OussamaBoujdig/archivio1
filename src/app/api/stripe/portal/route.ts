import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionByUserId } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const sub = getSubscriptionByUserId(user.id);
  if (!sub?.stripeCustomerId || !STRIPE_SECRET || sub.stripeCustomerId.startsWith("demo_")) {
    return NextResponse.json({ error: "Portal non disponible en mode démo", demo: true }, { status: 400 });
  }

  const res = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      customer: sub.stripeCustomerId,
      return_url: `${APP_URL}/billing`,
    }).toString(),
  });

  const session = await res.json();
  if (session.error) {
    return NextResponse.json({ error: session.error.message }, { status: 400 });
  }

  return NextResponse.json({ url: session.url });
}
