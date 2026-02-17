import { getSubscriptionByUserId, getDocuments, getUsers } from "./db";
import { getPlan } from "./plans";

export interface LimitCheck {
  allowed: boolean;
  reason?: string;
  planId: string;
  planName: string;
}

export function checkDocumentLimit(userId: string): LimitCheck {
  const sub = getSubscriptionByUserId(userId);
  const plan = getPlan(sub?.planId || "starter");

  if (plan.limits.maxDocuments === -1) {
    return { allowed: true, planId: plan.id, planName: plan.name };
  }

  const docs = getDocuments();
  if (docs.length >= plan.limits.maxDocuments) {
    return {
      allowed: false,
      reason: `Limite de ${plan.limits.maxDocuments} documents atteinte. Passez au plan supérieur.`,
      planId: plan.id,
      planName: plan.name,
    };
  }

  return { allowed: true, planId: plan.id, planName: plan.name };
}

export function checkStorageLimit(userId: string, additionalBytes: number = 0): LimitCheck {
  const sub = getSubscriptionByUserId(userId);
  const plan = getPlan(sub?.planId || "starter");

  const docs = getDocuments();
  const totalBytes = docs.reduce((sum, d) => sum + d.sizeBytes, 0) + additionalBytes;

  if (totalBytes > plan.limits.maxStorageBytes) {
    return {
      allowed: false,
      reason: `Limite de stockage atteinte (${formatBytes(plan.limits.maxStorageBytes)}). Passez au plan supérieur.`,
      planId: plan.id,
      planName: plan.name,
    };
  }

  return { allowed: true, planId: plan.id, planName: plan.name };
}

export function checkUserLimit(userId: string): LimitCheck {
  const sub = getSubscriptionByUserId(userId);
  const plan = getPlan(sub?.planId || "starter");

  if (plan.limits.maxUsers === -1) {
    return { allowed: true, planId: plan.id, planName: plan.name };
  }

  const users = getUsers();
  if (users.length >= plan.limits.maxUsers) {
    return {
      allowed: false,
      reason: `Limite de ${plan.limits.maxUsers} utilisateur${plan.limits.maxUsers > 1 ? "s" : ""} atteinte. Passez au plan supérieur.`,
      planId: plan.id,
      planName: plan.name,
    };
  }

  return { allowed: true, planId: plan.id, planName: plan.name };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
