"use client";

import { useState } from "react";
import { User, Mail, Building, Calendar, Shield, Save, Camera } from "lucide-react";
import { PlatformLayout } from "@/components/platform-layout";

export default function ProfilePage() {
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@entreprise.fr");
  const [role] = useState("Administrateur");
  const [org] = useState("Mon Entreprise");

  return (
    <PlatformLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Profil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="rounded border border-border bg-background p-6 text-center">
            <div className="relative mx-auto h-20 w-20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-foreground">
                <User className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground transition-colors">
                <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <h2 className="mt-4 text-sm font-semibold text-foreground">{name}</h2>
            <p className="text-xs text-muted-foreground">{role}</p>
            <p className="text-xs text-muted-foreground">{org}</p>

            <div className="mt-6 border-t border-border pt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-muted-foreground">{email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Building className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-muted-foreground">{org}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-muted-foreground">Membre depuis Jan 2025</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-muted-foreground">{role}</span>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded border border-border bg-background p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Informations personnelles
              </h2>
              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Rôle
                  </label>
                  <input
                    type="text"
                    value={role}
                    disabled
                    className="h-8 w-full rounded border border-border bg-muted px-3 text-sm text-muted-foreground outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Organisation
                  </label>
                  <input
                    type="text"
                    value={org}
                    disabled
                    className="h-8 w-full rounded border border-border bg-muted px-3 text-sm text-muted-foreground outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Décrivez-vous en quelques mots..."
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground resize-none"
                  />
                </div>
                <button className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
                  <Save className="h-4 w-4" strokeWidth={1.5} />
                  Enregistrer
                </button>
              </div>
            </div>

            <div className="rounded border border-border bg-background p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Activité récente
              </h2>
              <div className="space-y-4">
                {[
                  { action: "Document archivé", target: "Rapport annuel 2025", time: "Il y a 2 heures" },
                  { action: "Document importé", target: "Contrat de prestation N°4521", time: "Il y a 5 heures" },
                  { action: "Catégorie modifiée", target: "Rapports", time: "Hier" },
                  { action: "Paramètres mis à jour", target: "Notifications", time: "Il y a 3 jours" },
                  { action: "Document partagé", target: "Audit interne Q4 2025", time: "Il y a 1 semaine" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.target}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
