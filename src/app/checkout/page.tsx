"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, CreditCard, Lock, ArrowLeft, Shield, Zap } from "lucide-react";
import Link from "next/link";

const PLANS: Record<string, { name: string; priceMonthly: number; priceYearly: number; features: string[] }> = {
  pro: {
    name: "Pro",
    priceMonthly: 2900,
    priceYearly: 27900,
    features: ["Documents illimités", "50 GB de stockage", "10 utilisateurs", "Recherche avancée", "Import automatique", "Contrôle d'accès", "Support prioritaire"],
  },
  enterprise: {
    name: "Enterprise",
    priceMonthly: 9900,
    priceYearly: 95900,
    features: ["Documents illimités", "500 GB de stockage", "Utilisateurs illimités", "API & intégrations", "SSO & SAML", "Audit & conformité", "Support dédié 24/7"],
  },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-sm text-muted-foreground">Chargement...</p></div>}>
      <CheckoutInner />
    </Suspense>
  );
}

function CheckoutInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "pro";
  const initialCycle = (searchParams.get("cycle") || "monthly") as "monthly" | "yearly";

  const plan = PLANS[planId];
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(initialCycle);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Redirect if invalid plan
  useEffect(() => {
    if (!plan) router.push("/billing");
  }, [plan, router]);

  if (!plan) return null;

  const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const monthlyPrice = billingCycle === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly;
  const savings = billingCycle === "yearly" ? (plan.priceMonthly * 12 - plan.priceYearly) : 0;
  const discount = couponApplied ? Math.round(price * 0.1) : 0;
  const total = price - discount;

  const formatCard = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 16);
    return nums.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 4);
    if (nums.length > 2) return nums.slice(0, 2) + "/" + nums.slice(2);
    return nums;
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === "archivist10") {
      setCouponApplied(true);
      setError("");
    } else {
      setError("Code promo invalide");
      setCouponApplied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cardName.trim()) { setError("Nom du titulaire requis"); return; }
    if (cardNumber.replace(/\s/g, "").length < 16) { setError("Numéro de carte invalide"); return; }
    if (cardExpiry.length < 5) { setError("Date d'expiration invalide"); return; }
    if (cardCVC.length < 3) { setError("CVC invalide"); return; }

    setProcessing(true);

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
      } else if (result.success || result.demo) {
        router.push("/billing?upgraded=true");
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    }

    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
          <Link href="/billing" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Retour à la facturation
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
            Paiement sécurisé SSL
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Payment form */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Finaliser votre abonnement</h1>
              <p className="mt-1 text-sm text-muted-foreground">Complétez vos informations de paiement pour activer le plan {plan.name}</p>
            </div>

            {/* Billing cycle toggle */}
            <div className="rounded border border-border bg-background p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">Cycle de facturation</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setBillingCycle("monthly")}
                  className={`rounded border p-3 text-left transition-colors ${billingCycle === "monthly" ? "border-foreground bg-accent" : "border-border hover:border-foreground/30"}`}>
                  <p className="text-sm font-medium text-foreground">Mensuel</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{(plan.priceMonthly / 100).toFixed(0)}€/mois</p>
                </button>
                <button onClick={() => setBillingCycle("yearly")}
                  className={`rounded border p-3 text-left transition-colors relative ${billingCycle === "yearly" ? "border-foreground bg-accent" : "border-border hover:border-foreground/30"}`}>
                  <div className="absolute -top-2 right-2">
                    <span className="rounded-full bg-foreground px-2 py-0.5 text-[9px] font-semibold text-primary-foreground">-20%</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">Annuel</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{(plan.priceYearly / 100 / 12).toFixed(0)}€/mois</p>
                </button>
              </div>
            </div>

            {/* Card form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded border border-border bg-background p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Informations de paiement</p>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Nom du titulaire</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="h-9 w-full rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Numéro de carte</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCard(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="h-9 w-full rounded border border-border bg-background px-3 pr-20 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors font-mono tracking-wider"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-40">
                      <div className="h-5 w-8 rounded border border-border bg-accent flex items-center justify-center text-[8px] font-bold text-muted-foreground">VISA</div>
                      <div className="h-5 w-8 rounded border border-border bg-accent flex items-center justify-center text-[8px] font-bold text-muted-foreground">MC</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="h-9 w-full rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">CVC</label>
                    <input
                      type="text"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="h-9 w-full rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="rounded border border-border bg-background p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Code promo</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }}
                    placeholder="Entrez votre code"
                    className="h-8 flex-1 rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground"
                  />
                  <button type="button" onClick={handleApplyCoupon}
                    className="rounded border border-border px-4 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors">
                    Appliquer
                  </button>
                </div>
                {couponApplied && <p className="text-xs text-foreground mt-2 flex items-center gap-1"><Check className="h-3 w-3" strokeWidth={2} /> Réduction de 10% appliquée !</p>}
              </div>

              {error && (
                <div className="rounded border border-destructive/30 bg-destructive/5 px-4 py-2">
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 rounded bg-foreground px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {processing ? (
                  <>Traitement en cours...</>
                ) : (
                  <>
                    <Lock className="h-4 w-4" strokeWidth={1.5} />
                    Payer {(total / 100).toFixed(2)}€{billingCycle === "yearly" ? "/an" : "/mois"}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="h-3 w-3" /> Chiffrement SSL</div>
                <div className="flex items-center gap-1"><Lock className="h-3 w-3" /> PCI DSS</div>
                <div className="flex items-center gap-1"><Zap className="h-3 w-3" /> Activation instantanée</div>
              </div>
            </form>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="rounded border border-border bg-background p-6 lg:sticky lg:top-8">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-4">Récapitulatif</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Plan {plan.name}</p>
                    <p className="text-xs text-muted-foreground">{billingCycle === "yearly" ? "Facturation annuelle" : "Facturation mensuelle"}</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">{(monthlyPrice / 100).toFixed(0)}€<span className="text-xs text-muted-foreground">/mois</span></p>
                </div>

                {billingCycle === "yearly" && savings > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Économie annuelle</span>
                    <span className="text-foreground font-medium">-{(savings / 100).toFixed(0)}€</span>
                  </div>
                )}

                {couponApplied && discount > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Code promo (-10%)</span>
                    <span className="text-foreground font-medium">-{(discount / 100).toFixed(2)}€</span>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Total</span>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{(total / 100).toFixed(2)}€</p>
                      <p className="text-[10px] text-muted-foreground">{billingCycle === "yearly" ? "par an" : "par mois"} TTC</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">Inclus dans votre plan</p>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-foreground flex-shrink-0" strokeWidth={2} />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded bg-accent p-3">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    14 jours d&apos;essai gratuit inclus. Annulation possible à tout moment.
                    Vous ne serez débité qu&apos;à la fin de la période d&apos;essai.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
