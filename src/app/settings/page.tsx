"use client";

import { useState } from "react";
import { Save, User, Bell, Shield, Database } from "lucide-react";
import { PlatformLayout } from "@/components/platform-layout";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "Général", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "storage", label: "Stockage", icon: Database },
  ];

  return (
    <PlatformLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Paramètres</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configurez votre espace d&apos;archivage
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex md:flex-col md:w-48 gap-1 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 md:w-full items-center gap-2 rounded px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" strokeWidth={1.5} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeTab === "general" && (
            <div className="rounded border border-border bg-background p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Informations générales
              </h2>
              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Nom de l&apos;organisation
                  </label>
                  <input
                    type="text"
                    defaultValue="Mon Entreprise"
                    className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Email administrateur
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@entreprise.fr"
                    className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Langue
                  </label>
                  <select className="h-8 w-full rounded border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-foreground">
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Format de date
                  </label>
                  <select className="h-8 w-full rounded border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-foreground">
                    <option>JJ/MM/AAAA</option>
                    <option>MM/JJ/AAAA</option>
                    <option>AAAA-MM-JJ</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
                  <Save className="h-4 w-4" strokeWidth={1.5} />
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded border border-border bg-background p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Préférences de notification
              </h2>
              <div className="space-y-4 max-w-lg">
                {[
                  {
                    label: "Nouveau document ajouté",
                    desc: "Recevoir une notification quand un document est archivé",
                    defaultChecked: true,
                  },
                  {
                    label: "Document en attente",
                    desc: "Rappel pour les documents en attente de validation",
                    defaultChecked: true,
                  },
                  {
                    label: "Espace de stockage",
                    desc: "Alerte quand le stockage atteint 80%",
                    defaultChecked: false,
                  },
                  {
                    label: "Rapport hebdomadaire",
                    desc: "Résumé des activités de la semaine par email",
                    defaultChecked: false,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="peer sr-only"
                      />
                      <div className="h-5 w-9 rounded-full bg-border peer-checked:bg-foreground after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
                <button className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity mt-2">
                  <Save className="h-4 w-4" strokeWidth={1.5} />
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded border border-border bg-background p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Sécurité
              </h2>
              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Authentification à deux facteurs
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ajouter une couche de sécurité supplémentaire
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="h-5 w-9 rounded-full bg-border peer-checked:bg-foreground after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                </div>
                <button className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
                  <Save className="h-4 w-4" strokeWidth={1.5} />
                  Mettre à jour
                </button>
              </div>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="rounded border border-border bg-background p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Gestion du stockage
              </h2>
              <div className="space-y-5 max-w-lg">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Espace utilisé
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      20.8 MB / 50 GB
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-accent">
                    <div
                      className="h-1 rounded-full bg-foreground"
                      style={{ width: "0.04%" }}
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Répartition par type
                  </h3>
                  {[
                    { type: "PDF", size: "15.2 MB", percent: 73 },
                    { type: "DOCX", size: "3.1 MB", percent: 15 },
                    { type: "PPTX", size: "2.5 MB", percent: 12 },
                  ].map((item) => (
                    <div key={item.type}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-foreground font-medium">
                          {item.type}
                        </span>
                        <span className="text-muted-foreground">
                          {item.size}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-accent">
                        <div
                          className="h-1 rounded-full bg-foreground/40"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Durée de rétention par défaut
                    </label>
                    <select className="h-8 w-full rounded border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-foreground">
                      <option>Illimitée</option>
                      <option>1 an</option>
                      <option>3 ans</option>
                      <option>5 ans</option>
                      <option>10 ans</option>
                    </select>
                  </div>
                </div>

                <button className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
                  <Save className="h-4 w-4" strokeWidth={1.5} />
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </PlatformLayout>
  );
}
