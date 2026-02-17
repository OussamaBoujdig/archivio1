export interface PlanLimits {
  maxDocuments: number;       // -1 = unlimited
  maxStorageBytes: number;    // in bytes
  maxUsers: number;           // -1 = unlimited
  advancedSearch: boolean;
  autoImport: boolean;
  accessControl: boolean;
  apiAccess: boolean;
  sso: boolean;
  audit: boolean;
  prioritySupport: boolean;
  dedicatedSupport: boolean;
}

export interface Plan {
  id: "starter" | "pro" | "enterprise";
  name: string;
  description: string;
  priceMonthly: number;       // in cents (EUR)
  priceYearly: number;        // in cents (EUR) — per year
  stripePriceMonthly: string; // Stripe Price ID
  stripePriceYearly: string;  // Stripe Price ID
  limits: PlanLimits;
  features: string[];
  highlighted: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Pour les indépendants et petites équipes",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceMonthly: "",
    stripePriceYearly: "",
    limits: {
      maxDocuments: 50,
      maxStorageBytes: 500 * 1024 * 1024, // 500 MB
      maxUsers: 1,
      advancedSearch: false,
      autoImport: false,
      accessControl: false,
      apiAccess: false,
      sso: false,
      audit: false,
      prioritySupport: false,
      dedicatedSupport: false,
    },
    features: [
      "50 documents",
      "500 MB de stockage",
      "1 utilisateur",
      "Recherche basique",
      "Support email",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les PME et équipes en croissance",
    priceMonthly: 2900,   // 29€
    priceYearly: 27900,   // 279€ (= 23.25€/mois)
    stripePriceMonthly: process.env.STRIPE_PRO_MONTHLY || "",
    stripePriceYearly: process.env.STRIPE_PRO_YEARLY || "",
    limits: {
      maxDocuments: -1,
      maxStorageBytes: 50 * 1024 * 1024 * 1024, // 50 GB
      maxUsers: 10,
      advancedSearch: true,
      autoImport: true,
      accessControl: true,
      apiAccess: false,
      sso: false,
      audit: false,
      prioritySupport: true,
      dedicatedSupport: false,
    },
    features: [
      "Documents illimités",
      "50 GB de stockage",
      "10 utilisateurs",
      "Recherche avancée",
      "Import automatique",
      "Contrôle d'accès",
      "Support prioritaire",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Pour les grandes organisations",
    priceMonthly: 9900,   // 99€
    priceYearly: 95900,   // 959€ (= 79.9€/mois)
    stripePriceMonthly: process.env.STRIPE_ENTERPRISE_MONTHLY || "",
    stripePriceYearly: process.env.STRIPE_ENTERPRISE_YEARLY || "",
    limits: {
      maxDocuments: -1,
      maxStorageBytes: 500 * 1024 * 1024 * 1024, // 500 GB
      maxUsers: -1,
      advancedSearch: true,
      autoImport: true,
      accessControl: true,
      apiAccess: true,
      sso: true,
      audit: true,
      prioritySupport: true,
      dedicatedSupport: true,
    },
    features: [
      "Documents illimités",
      "500 GB de stockage",
      "Utilisateurs illimités",
      "API & intégrations",
      "SSO & SAML",
      "Audit & conformité",
      "Support dédié 24/7",
    ],
    highlighted: false,
  },
];

export function getPlan(planId: string): Plan {
  return PLANS.find((p) => p.id === planId) || PLANS[0];
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "0";
  return (cents / 100).toFixed(0);
}
