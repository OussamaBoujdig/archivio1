"use client";

import { useState, useEffect } from "react";
import { User, Mail, Building, Calendar, Shield, Save, Camera } from "lucide-react";
import { PlatformLayout } from "@/components/platform-layout";
import { useAuth } from "@/components/auth-provider";

interface Activity {
  id: string;
  action: string;
  target: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [org, setOrg] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setName(d.user.name || "");
          setEmail(d.user.email || "");
          setBio(d.user.bio || "");
          setOrg(d.user.organization || "");
        }
      })
      .catch(() => {});

    fetch("/api/activities")
      .then((r) => r.json())
      .then((d) => setActivities(d.activities || []))
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, bio, organization: org }),
    });
    if (res.ok) {
      setSaved(true);
      refreshUser();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const role = user?.role === "admin" ? "Administrateur" : "Utilisateur";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : "Jan 2025";

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
            <h2 className="mt-4 text-sm font-semibold text-foreground">{name || user?.name}</h2>
            <p className="text-xs text-muted-foreground">{role}</p>
            <p className="text-xs text-muted-foreground">{org || user?.organization}</p>

            <div className="mt-6 border-t border-border pt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-muted-foreground">{email || user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Building className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-muted-foreground">{org || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-muted-foreground">Membre depuis {memberSince}</span>
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
                    onChange={(e) => setOrg(e.target.value)}
                    className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Décrivez-vous en quelques mots..."
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-40"
                  >
                    <Save className="h-4 w-4" strokeWidth={1.5} />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  {saved && (
                    <span className="text-xs text-success">✓ Profil mis à jour</span>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded border border-border bg-background p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Activité récente
              </h2>
              <div className="space-y-4">
                {activities.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.target}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune activité</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)}sem`;
}
