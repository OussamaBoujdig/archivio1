import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionByUserId, getDocuments, getUsers, getInvoices } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { getPlan } from "@/lib/plans";

export async function GET() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const sub = getSubscriptionByUserId(user.id);
  const plan = getPlan(sub?.planId || "starter");
  const docs = getDocuments();
  const users = getUsers();
  const invoices = getInvoices(user.id);

  const totalStorageBytes = docs.reduce((sum, d) => sum + d.sizeBytes, 0);
  const totalDocuments = docs.length;
  const totalUsers = users.length;

  const usage = {
    documents: {
      used: totalDocuments,
      limit: plan.limits.maxDocuments,
      percent: plan.limits.maxDocuments === -1 ? 0 : Math.round((totalDocuments / plan.limits.maxDocuments) * 100),
    },
    storage: {
      usedBytes: totalStorageBytes,
      usedFormatted: formatBytes(totalStorageBytes),
      limitBytes: plan.limits.maxStorageBytes,
      limitFormatted: formatBytes(plan.limits.maxStorageBytes),
      percent: Math.round((totalStorageBytes / plan.limits.maxStorageBytes) * 100),
    },
    users: {
      used: totalUsers,
      limit: plan.limits.maxUsers,
      percent: plan.limits.maxUsers === -1 ? 0 : Math.round((totalUsers / plan.limits.maxUsers) * 100),
    },
  };

  return NextResponse.json({
    subscription: sub ? {
      id: sub.id,
      planId: sub.planId,
      status: sub.status,
      billingCycle: sub.billingCycle,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      trialEnd: sub.trialEnd,
    } : null,
    plan: {
      id: plan.id,
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      limits: plan.limits,
      features: plan.features,
    },
    usage,
    invoices: invoices.slice(0, 10),
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
