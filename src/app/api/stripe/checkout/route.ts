import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, generateId } from "@/lib/auth";
import { getSubscriptionByUserId, createSubscription, updateSubscription } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { getPlan } from "@/lib/plans";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function stripeRequest(endpoint: string, body: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { planId, billingCycle } = await req.json();
  const plan = getPlan(planId);

  if (plan.id === "starter") {
    // Downgrade to free — just update subscription
    const sub = getSubscriptionByUserId(user.id);
    if (sub) {
      updateSubscription(sub.id, {
        planId: "starter",
        status: "active",
        stripeSubscriptionId: "",
        cancelAtPeriodEnd: false,
      });
    }
    return NextResponse.json({ success: true, free: true });
  }

  const priceId = billingCycle === "yearly" ? plan.stripePriceYearly : plan.stripePriceMonthly;

  // If no Stripe key configured, simulate the upgrade (demo mode)
  if (!STRIPE_SECRET || !priceId) {
    const sub = getSubscriptionByUserId(user.id);
    const now = new Date();
    const periodEnd = new Date(now.getTime() + (billingCycle === "yearly" ? 365 : 30) * 86400000);

    if (sub) {
      updateSubscription(sub.id, {
        planId: plan.id,
        status: "active",
        billingCycle: billingCycle || "monthly",
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        stripeCustomerId: `demo_cus_${user.id}`,
        stripeSubscriptionId: `demo_sub_${generateId()}`,
      });
    } else {
      createSubscription({
        id: generateId(),
        userId: user.id,
        planId: plan.id,
        status: "active",
        billingCycle: billingCycle || "monthly",
        stripeCustomerId: `demo_cus_${user.id}`,
        stripeSubscriptionId: `demo_sub_${generateId()}`,
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false,
        trialEnd: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    }

    return NextResponse.json({ success: true, demo: true, redirectUrl: "/billing?upgraded=true" });
  }

  // Real Stripe checkout
  let sub = getSubscriptionByUserId(user.id);
  let customerId = sub?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripeRequest("/customers", {
      email: user.email,
      name: user.name,
      "metadata[userId]": user.id,
    });
    customerId = customer.id;

    if (sub) {
      updateSubscription(sub.id, { stripeCustomerId: customerId });
    }
  }

  const session = await stripeRequest("/checkout/sessions", {
    customer: customerId!,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    mode: "subscription",
    success_url: `${APP_URL}/billing?session_id={CHECKOUT_SESSION_ID}&upgraded=true`,
    cancel_url: `${APP_URL}/billing`,
    "metadata[userId]": user.id,
    "metadata[planId]": plan.id,
    "metadata[billingCycle]": billingCycle || "monthly",
    allow_promotion_codes: "true",
  });

  if (session.error) {
    return NextResponse.json({ error: session.error.message }, { status: 400 });
  }

  return NextResponse.json({ url: session.url });
}
