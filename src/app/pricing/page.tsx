import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Check, ArrowRight } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "0",
    period: "Gratuit",
    desc: "Pour les indépendants et petites équipes",
    features: ["50 documents", "500 MB de stockage", "1 utilisateur", "Recherche basique", "Support email"],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "29",
    period: "/ mois",
    desc: "Pour les PME et équipes en croissance",
    features: ["Documents illimités", "50 GB de stockage", "10 utilisateurs", "Recherche avancée", "Import automatique", "Contrôle d'accès", "Support prioritaire"],
    cta: "Démarrer l'essai gratuit",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "99",
    period: "/ mois",
    desc: "Pour les grandes organisations",
    features: ["Documents illimités", "500 GB de stockage", "Utilisateurs illimités", "API & intégrations", "SSO & SAML", "Audit & conformité", "Support dédié 24/7"],
    cta: "Contacter les ventes",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            <span className="text-sm font-semibold tracking-tight text-foreground">Archivist</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Connexion</Link>
            <Link href="/register" className="rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">S&apos;inscrire</Link>
          </div>
        </div>
      </nav>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">Tarifs</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Un plan pour chaque besoin
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Commencez gratuitement, évoluez selon vos besoins. Tous les plans payants incluent 14 jours d&apos;essai gratuit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`rounded border p-8 flex flex-col ${plan.highlighted ? "border-foreground relative" : "border-border"}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">Populaire</span>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-foreground">{plan.price}€</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-foreground flex-shrink-0" strokeWidth={2} />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 flex items-center justify-center gap-2 rounded px-4 py-3 text-sm font-semibold transition-opacity ${
                    plan.highlighted
                      ? "bg-foreground text-primary-foreground hover:opacity-80"
                      : "border border-border text-foreground hover:bg-accent"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Besoin d&apos;un plan sur-mesure ?{" "}
              <a href="mailto:contact@archivist.fr" className="text-foreground font-medium hover:underline">
                Contactez-nous
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
