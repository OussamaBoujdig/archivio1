import Link from "next/link";
import {
  FileText,
  Shield,
  Search,
  Zap,
  Lock,
  BarChart3,
  ArrowRight,
  Check,
  Star,
  Users,
  Globe,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 md:h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            <span className="text-base font-semibold tracking-tight text-foreground">
              Archivist
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tarifs
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Témoignages
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Connexion
            </Link>
            <a
              href="#pricing"
              className="rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity"
            >
              Commencer
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              +2 000 entreprises nous font confiance
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            L&apos;archivage digital
            <br />
            <span className="text-muted-foreground">simplifié.</span>
          </h1>

          <p className="mt-4 md:mt-6 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Centralisez, sécurisez et retrouvez tous vos documents en quelques
            secondes. La plateforme d&apos;archivage conçue pour les entreprises
            modernes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="flex items-center gap-2 rounded bg-foreground px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-80 transition-opacity"
            >
              Démarrer gratuitement
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 rounded border border-border px-8 py-3.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Découvrir les fonctionnalités
            </a>
          </div>

          <div className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" strokeWidth={2} />
              <span>14 jours d&apos;essai gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" strokeWidth={2} />
              <span>Sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" strokeWidth={2} />
              <span>Annulation à tout moment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social proof bar */}
      <section className="border-y border-border py-8 md:py-10 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-8">
            Ils nous font confiance
          </p>
          <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap opacity-40">
            {["TechCorp", "FinanceGroup", "LegalPro", "MediaPlus", "IndustrieX"].map(
              (name) => (
                <span
                  key={name}
                  className="text-lg font-bold tracking-tight text-foreground"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: "50K+", label: "Documents archivés", icon: FileText },
            { value: "2 000+", label: "Entreprises actives", icon: Users },
            { value: "99.9%", label: "Disponibilité", icon: Globe },
            { value: "<2s", label: "Temps de recherche", icon: Clock },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon
                className="mx-auto h-5 w-5 text-muted-foreground mb-3"
                strokeWidth={1.5}
              />
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20 px-4 md:px-6 bg-accent">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Fonctionnalités
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Une suite complète d&apos;outils pour gérer vos archives numériques
              de manière professionnelle et sécurisée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Recherche instantanée",
                desc: "Retrouvez n'importe quel document en moins de 2 secondes grâce à notre moteur de recherche intelligent.",
              },
              {
                icon: Shield,
                title: "Sécurité maximale",
                desc: "Chiffrement AES-256, authentification 2FA et conformité RGPD pour protéger vos données sensibles.",
              },
              {
                icon: Zap,
                title: "Import automatique",
                desc: "Glissez-déposez vos fichiers ou connectez vos outils existants pour un import automatique.",
              },
              {
                icon: Lock,
                title: "Contrôle d'accès",
                desc: "Gérez finement les permissions par utilisateur, équipe ou catégorie de documents.",
              },
              {
                icon: BarChart3,
                title: "Tableaux de bord",
                desc: "Visualisez l'activité, le stockage et les statistiques de votre espace d'archivage en temps réel.",
              },
              {
                icon: FileText,
                title: "Multi-formats",
                desc: "PDF, DOCX, XLSX, PPTX et bien plus. Tous vos formats de documents sont pris en charge.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded border border-border bg-white p-6 hover:border-foreground/20 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-accent border border-border">
                  <feature.icon
                    className="h-5 w-5 text-foreground"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Tarifs
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Un plan pour chaque besoin
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Commencez gratuitement, évoluez selon vos besoins. Tous les plans
              incluent 14 jours d&apos;essai gratuit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Starter",
                price: "0",
                period: "Gratuit",
                desc: "Pour les indépendants et petites équipes",
                features: [
                  "500 documents",
                  "2 GB de stockage",
                  "1 utilisateur",
                  "Recherche basique",
                  "Support email",
                ],
                cta: "Commencer gratuitement",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "29",
                period: "/ mois",
                desc: "Pour les PME et équipes en croissance",
                features: [
                  "Documents illimités",
                  "50 GB de stockage",
                  "10 utilisateurs",
                  "Recherche avancée",
                  "Import automatique",
                  "Contrôle d'accès",
                  "Support prioritaire",
                ],
                cta: "Démarrer l'essai gratuit",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "99",
                period: "/ mois",
                desc: "Pour les grandes organisations",
                features: [
                  "Documents illimités",
                  "500 GB de stockage",
                  "Utilisateurs illimités",
                  "API & intégrations",
                  "SSO & SAML",
                  "Audit & conformité",
                  "Support dédié 24/7",
                ],
                cta: "Contacter les ventes",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded border p-8 flex flex-col ${
                  plan.highlighted
                    ? "border-foreground bg-white relative"
                    : "border-border bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
                      Populaire
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      {plan.price}€
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.desc}
                  </p>
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check
                        className="h-4 w-4 text-foreground flex-shrink-0"
                        strokeWidth={2}
                      />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`mt-8 flex items-center justify-center rounded px-4 py-3 text-sm font-semibold transition-opacity ${
                    plan.highlighted
                      ? "bg-foreground text-primary-foreground hover:opacity-80"
                      : "border border-border text-foreground hover:bg-accent"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 md:py-20 px-4 md:px-6 bg-accent">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Témoignages
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Archivist a transformé notre gestion documentaire. On retrouve tout en quelques secondes.",
                author: "Marie Dupont",
                role: "Directrice Financière, TechCorp",
              },
              {
                quote:
                  "La sécurité et la conformité RGPD étaient essentielles pour nous. Archivist coche toutes les cases.",
                author: "Jean Martin",
                role: "Responsable Juridique, LegalPro",
              },
              {
                quote:
                  "L'interface est incroyablement simple. Toute l'équipe l'a adoptée en moins d'une journée.",
                author: "Sophie Bernard",
                role: "DRH, MediaPlus",
              },
            ].map((t) => (
              <div
                key={t.author}
                className="rounded border border-border bg-white p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-foreground fill-foreground"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">
                    {t.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Comment fonctionne l'essai gratuit ?",
                a: "Vous bénéficiez de 14 jours d'accès complet au plan Pro, sans carte bancaire requise. À la fin de l'essai, vous pouvez choisir un plan ou rester sur le plan Starter gratuit.",
              },
              {
                q: "Mes documents sont-ils sécurisés ?",
                a: "Absolument. Nous utilisons un chiffrement AES-256, des sauvegardes quotidiennes et nos serveurs sont hébergés en France, conformément au RGPD.",
              },
              {
                q: "Puis-je migrer mes documents existants ?",
                a: "Oui, notre outil d'import en masse vous permet de transférer des milliers de documents en quelques minutes. Notre équipe peut aussi vous accompagner.",
              },
              {
                q: "Quels formats de fichiers sont supportés ?",
                a: "PDF, DOCX, XLSX, PPTX, DOC, XLS, PPT et bien d'autres. Nous ajoutons régulièrement de nouveaux formats.",
              },
              {
                q: "Puis-je changer de plan à tout moment ?",
                a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement prend effet immédiatement avec un prorata.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded border border-border bg-white p-6"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {item.q}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground">
            Prêt à simplifier votre archivage ?
          </h2>
          <p className="mt-4 text-primary-foreground/70 max-w-xl mx-auto">
            Rejoignez plus de 2 000 entreprises qui font confiance à Archivist
            pour gérer leurs documents numériques.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded bg-white px-8 py-3.5 text-sm font-semibold text-foreground hover:opacity-90 transition-opacity"
            >
              Démarrer maintenant
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <a
              href="#pricing"
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Voir les tarifs →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 md:py-12 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText
                  className="h-4 w-4 text-foreground"
                  strokeWidth={1.5}
                />
                <span className="text-sm font-semibold text-foreground">
                  Archivist
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                La plateforme d&apos;archivage digital pour les entreprises
                modernes.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Produit
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Entreprise
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Légal
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    CGV
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Confidentialité
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              © 2026 Archivist. Tous droits réservés.
            </p>
            <p className="text-xs text-muted-foreground">
              Hébergé en France 🇫🇷
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
