"use client";

import { useState, useEffect } from "react";
import { CreditCard, Check, Zap, ArrowUpRight, FileText, HardDrive, Users, AlertTriangle } from "lucide-react";
import { PlatformLayout } from "@/components/platform-layout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface SubData {
  subscription: {
    planId: string;
    status: string;
    billingCycle: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
  plan: {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    limits: Record<string, unknown>;
    features: string[];
  };
  usage: {
    documents: { used: number; limit: number; percent: number };
    storage: { usedBytes: number; usedFormatted: string; limitBytes: number; limitFormatted: string; percent: number };
    users: { used: number; limit: number; percent: number };
  };
  invoices: Array<{ id: string; description: string; amountPaid: number; currency: string; status: string; paidAt: string; createdAt: string }>;
}

const PLANS = [
  { id: "starter", name: "Starter", priceMonthly: 0, priceYearly: 0, desc: "Pour les indépendants", features: ["50 documents", "500 MB", "1 utilisateur", "Support email"] },
  { id: "pro", name: "Pro", priceMonthly: 2900, priceYearly: 27900, desc: "Pour les PME", features: ["Documents illimités", "50 GB", "10 utilisateurs", "Support prioritaire"], highlighted: true },
  { id: "enterprise", name: "Enterprise", priceMonthly: 9900, priceYearly: 95900, desc: "Pour les grandes orgs", features: ["Documents illimités", "500 GB", "Utilisateurs illimités", "Support dédié 24/7"] },
];

export default function BillingPage() {
  return (
    <Suspense fallback={<PlatformLayout><div className="flex items-center justify-center h-64"><p className="text-sm text-muted-foreground">Chargement...</p></div></PlatformLayout>}>
      <BillingPageInner />
    </Suspense>
  );
}

function BillingPageInner() {
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded");
  const [data, setData] = useState<SubData | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(!!upgraded);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => { if (r.ok) return r.json(); throw 0; })
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const result = await res.json();

      if (result.url) {
        window.location.href = result.url;
      } else if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else if (result.success) {
        window.location.reload();
      }
    } catch { /* ignore */ }
    setUpgrading(null);
  };

  const handlePortal = async () => {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const result = await res.json();
    if (result.url) {
      window.location.href = result.url;
    } else if (result.demo) {
      alert("Le portail de facturation n'est pas disponible en mode démo. Utilisez les boutons ci-dessous pour changer de plan.");
    }
  };

  if (!data) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </PlatformLayout>
    );
  }

  const currentPlan = data.plan;
  const sub = data.subscription;
  const usage = data.usage;

  return (
    <PlatformLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Facturation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez votre abonnement et suivez votre consommation
          </p>
        </div>

        {showSuccess && (
          <div className="rounded border border-foreground/20 bg-foreground/5 px-4 py-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-foreground" strokeWidth={2} />
            <span className="text-sm text-foreground font-medium">Plan mis à jour avec succès !</span>
          </div>
        )}

        {/* Current Plan */}
        <div className="rounded border border-border bg-background p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Plan actuel</h2>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  sub?.status === "active" ? "bg-foreground/10 text-foreground" :
                  sub?.status === "trialing" ? "bg-foreground/10 text-foreground" :
                  "bg-destructive/10 text-destructive"
                }`}>
                  {sub?.status === "active" ? "Actif" : sub?.status === "trialing" ? "Essai" : sub?.status === "past_due" ? "Paiement en retard" : "Actif"}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{currentPlan.name}</span>
                {currentPlan.priceMonthly > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {(sub?.billingCycle === "yearly" ? currentPlan.priceYearly / 12 : currentPlan.priceMonthly) / 100}€/mois
                    {sub?.billingCycle === "yearly" && " (annuel)"}
                  </span>
                )}
                {currentPlan.priceMonthly === 0 && (
                  <span className="text-sm text-muted-foreground">Gratuit</span>
                )}
              </div>
              {sub?.currentPeriodEnd && currentPlan.id !== "starter" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {sub.cancelAtPeriodEnd ? "Se termine le" : "Prochain renouvellement le"}{" "}
                  {new Date(sub.currentPeriodEnd).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
            {currentPlan.id !== "starter" && (
              <button onClick={handlePortal}
                className="flex items-center gap-2 rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
                <CreditCard className="h-3.5 w-3.5" strokeWidth={1.5} />
                Gérer la facturation
              </button>
            )}
          </div>
        </div>

        {/* Usage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UsageMeter
            icon={FileText}
            label="Documents"
            used={usage.documents.used}
            limit={usage.documents.limit}
            percent={usage.documents.percent}
            formatValue={(v) => `${v}`}
            formatLimit={(v) => v === -1 ? "Illimité" : `${v}`}
          />
          <UsageMeter
            icon={HardDrive}
            label="Stockage"
            used={usage.storage.usedBytes}
            limit={usage.storage.limitBytes}
            percent={usage.storage.percent}
            formatValue={() => usage.storage.usedFormatted}
            formatLimit={() => usage.storage.limitFormatted}
          />
          <UsageMeter
            icon={Users}
            label="Utilisateurs"
            used={usage.users.used}
            limit={usage.users.limit}
            percent={usage.users.percent}
            formatValue={(v) => `${v}`}
            formatLimit={(v) => v === -1 ? "Illimité" : `${v}`}
          />
        </div>

        {/* Plan Selection */}
        <div className="rounded border border-border bg-background p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Changer de plan</h2>
            <div className="flex items-center rounded border border-border">
              <button onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${billingCycle === "monthly" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Mensuel
              </button>
              <button onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${billingCycle === "yearly" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Annuel <span className="text-[10px] opacity-70">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan.id;
              const price = billingCycle === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly;

              return (
                <div key={plan.id} className={`rounded border p-5 flex flex-col ${
                  plan.highlighted && !isCurrent ? "border-foreground" : isCurrent ? "border-foreground/30 bg-accent" : "border-border"
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                    {isCurrent && <span className="text-[10px] font-medium text-muted-foreground bg-background rounded px-2 py-0.5 border border-border">Actuel</span>}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">{price === 0 ? "0" : (price / 100).toFixed(0)}€</span>
                    <span className="text-xs text-muted-foreground">/mois</span>
                  </div>
                  {billingCycle === "yearly" && plan.priceYearly > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">Facturé {(plan.priceYearly / 100).toFixed(0)}€/an</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{plan.desc}</p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-foreground flex-shrink-0" strokeWidth={2} />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => !isCurrent && handleUpgrade(plan.id)}
                    disabled={isCurrent || upgrading === plan.id}
                    className={`mt-4 flex items-center justify-center gap-2 rounded px-4 py-2 text-xs font-semibold transition-all ${
                      isCurrent
                        ? "border border-border text-muted-foreground cursor-default"
                        : plan.highlighted
                          ? "bg-foreground text-primary-foreground hover:opacity-80"
                          : "border border-border text-foreground hover:bg-accent"
                    } disabled:opacity-50`}
                  >
                    {isCurrent ? "Plan actuel" : upgrading === plan.id ? "Traitement..." : (
                      <>
                        {plan.priceMonthly > currentPlan.priceMonthly ? "Upgrader" : "Changer"}
                        <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded border border-border bg-background p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-4">Historique de facturation</h2>
          {data.invoices.length > 0 ? (
            <div className="space-y-0 divide-y divide-border">
              {data.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm text-foreground">{inv.description}</p>
                    <p className="text-xs text-muted-foreground">{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("fr-FR") : new Date(inv.createdAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">{(inv.amountPaid / 100).toFixed(2)}€</span>
                    <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${inv.status === "paid" ? "bg-foreground/10 text-foreground" : "bg-destructive/10 text-destructive"}`}>
                      {inv.status === "paid" ? "Payée" : "En attente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune facture pour le moment</p>
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}

function UsageMeter({ icon: Icon, label, used, limit, percent, formatValue, formatLimit }: {
  icon: React.ElementType; label: string; used: number; limit: number; percent: number;
  formatValue: (v: number) => string; formatLimit: (v: number) => string;
}) {
  const isNearLimit = percent >= 80 && limit !== -1;
  const isOverLimit = percent >= 100 && limit !== -1;

  return (
    <div className={`rounded border p-4 ${isOverLimit ? "border-destructive/50 bg-destructive/5" : "border-border bg-background"}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {isNearLimit && !isOverLimit && <AlertTriangle className="h-3 w-3 text-foreground/60" strokeWidth={2} />}
        {isOverLimit && <AlertTriangle className="h-3 w-3 text-destructive" strokeWidth={2} />}
      </div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-lg font-bold text-foreground">{formatValue(used)}</span>
        <span className="text-xs text-muted-foreground">/ {formatLimit(limit)}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-accent">
        <div
          className={`h-1 rounded-full transition-all ${isOverLimit ? "bg-destructive" : isNearLimit ? "bg-foreground/70" : "bg-foreground"}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">{limit === -1 ? "Illimité" : `${percent}% utilisé`}</p>
    </div>
  );
}
