"use client";

import { useState, useEffect } from "react";
import { Save, User, Bell, Shield, Database, Users, Plus, Trash2, Camera, Mail, Building, Calendar } from "lucide-react";
import { PlatformLayout } from "@/components/platform-layout";
import { useAuth } from "@/components/auth-provider";

interface TeamUser { id: string; name: string; email: string; role: string; createdAt: string; }

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [org, setOrg] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("employé");
  const [teamError, setTeamError] = useState("");
  const [storageUsed, setStorageUsed] = useState("0 B");
  const [storagePct, setStoragePct] = useState(0);

  useEffect(() => {
    fetch("/api/profile").then(r => { if (r.ok) return r.json(); throw 0; })
      .then(d => { if (d.user) { setName(d.user.name||""); setEmail(d.user.email||""); setBio(d.user.bio||""); setOrg(d.user.organization||""); } }).catch(() => {});
    fetch("/api/dashboard").then(r => { if (r.ok) return r.json(); throw 0; })
      .then(d => { setStorageUsed(d.totalStorageFormatted||"0 B"); setStoragePct(Math.max((d.totalStorageBytes||0)/(50*1024*1024*1024)*100,0.1)); }).catch(() => {});
  }, []);

  useEffect(() => { if (isAdmin) fetchTeam(); }, [isAdmin]);
  const fetchTeam = () => { fetch("/api/users").then(r=>r.json()).then(d=>setTeamUsers(d.users||[])).catch(()=>{}); };

  const handleSaveProfile = async () => {
    setSaving(true); setSaved(false);
    const r = await fetch("/api/profile", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({name,email,bio,organization:org}) });
    if (r.ok) { setSaved(true); refreshUser(); setTimeout(()=>setSaved(false),3000); }
    setSaving(false);
  };
  const handleAddUser = async () => {
    setTeamError("");
    if (!newName||!newEmail||!newPassword) { setTeamError("Tous les champs sont requis"); return; }
    const r = await fetch("/api/users", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:newName,email:newEmail,password:newPassword,role:newRole}) });
    if (r.ok) { setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("employé"); setShowAddUser(false); fetchTeam(); }
    else { const d = await r.json(); setTeamError(d.error||"Erreur"); }
  };
  const handleDeleteUser = async (id: string) => { if (!confirm("Supprimer cet utilisateur ?")) return; const r = await fetch(`/api/users/${id}`,{method:"DELETE"}); if (r.ok) fetchTeam(); };
  const handleChangeRole = async (id: string, role: string) => { await fetch(`/api/users/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({role})}); fetchTeam(); };

  const roleName = user?.role === "admin" ? "Administrateur" : user?.role === "employé" ? "Employé" : "Utilisateur";
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR",{month:"long",year:"numeric"}) : "";

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "storage", label: "Stockage", icon: Database },
    ...(isAdmin ? [{ id: "team", label: "Équipe", icon: Users }] : []),
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
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                  <p className="text-xs text-muted-foreground">{roleName}</p>
                  <div className="mt-6 border-t border-border pt-4 space-y-3 text-left">
                    <div className="flex items-center gap-2 text-xs"><Mail className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} /><span className="text-muted-foreground">{email || user?.email}</span></div>
                    <div className="flex items-center gap-2 text-xs"><Building className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} /><span className="text-muted-foreground">{org || "Non renseigné"}</span></div>
                    <div className="flex items-center gap-2 text-xs"><Calendar className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} /><span className="text-muted-foreground">Membre depuis {memberSince}</span></div>
                    <div className="flex items-center gap-2 text-xs"><Shield className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} /><span className="text-muted-foreground">{roleName}</span></div>
                  </div>
                </div>
                <div className="lg:col-span-2 rounded border border-border bg-background p-6">
                  <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-6">Informations personnelles</h2>
                  <div className="space-y-5 max-w-lg">
                    <div><label className="block text-xs text-muted-foreground mb-1">Nom complet</label><input type="text" value={name} onChange={e=>setName(e.target.value)} className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground" /></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Adresse email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground" /></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Organisation</label><input type="text" value={org} onChange={e=>setOrg(e.target.value)} className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground" /></div>
                    <div><label className="block text-xs text-muted-foreground mb-1">Bio</label><textarea rows={3} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Décrivez-vous en quelques mots..." className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground resize-none" /></div>
                    <div className="flex items-center gap-3">
                      <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-40"><Save className="h-4 w-4" strokeWidth={1.5} />{saving ? "Enregistrement..." : "Enregistrer"}</button>
                      {saved && <span className="text-xs text-muted-foreground">Profil mis à jour</span>}
                    </div>
                  </div>
                </div>
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
                    <span className="text-sm text-muted-foreground">Espace utilisé</span>
                    <span className="text-sm font-semibold text-foreground">{storageUsed} / 50 GB</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-accent">
                    <div className="h-1 rounded-full bg-foreground" style={{ width: `${storagePct}%` }} />
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <label className="block text-xs text-muted-foreground mb-1">Durée de rétention par défaut</label>
                  <select className="h-8 w-full rounded border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-foreground">
                    <option>Illimitée</option><option>1 an</option><option>3 ans</option><option>5 ans</option><option>10 ans</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
                  <Save className="h-4 w-4" strokeWidth={1.5} />
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {activeTab === "team" && isAdmin && (
            <div className="rounded border border-border bg-background p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Membres de l&apos;équipe ({teamUsers.length})
                </h2>
                <button onClick={() => setShowAddUser(!showAddUser)} className="flex items-center gap-2 rounded bg-foreground px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-80 transition-opacity">
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Ajouter
                </button>
              </div>

              {showAddUser && (
                <div className="mb-6 rounded border border-border bg-accent p-4 space-y-3">
                  {teamError && <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{teamError}</div>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Nom complet" value={newName} onChange={e => setNewName(e.target.value)} className="h-8 rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground" />
                    <input type="email" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="h-8 rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground" />
                    <input type="password" placeholder="Mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-8 rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground" />
                    <select value={newRole} onChange={e => setNewRole(e.target.value)} className="h-8 rounded border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-foreground">
                      <option value="employé">Employé</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <button onClick={handleAddUser} className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                    Créer le compte
                  </button>
                </div>
              )}

              <div className="divide-y divide-border">
                {teamUsers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-foreground">
                        <User className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={member.role} onChange={e => handleChangeRole(member.id, e.target.value)} disabled={member.id === user?.id}
                        className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-foreground disabled:opacity-50">
                        <option value="admin">Admin</option>
                        <option value="employé">Employé</option>
                      </select>
                      {member.id !== user?.id && (
                        <button onClick={() => handleDeleteUser(member.id)} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors" title="Supprimer">
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Permissions par rôle</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-foreground w-24 shrink-0">Admin</span>
                    <span>Accès complet : documents, catégories, paramètres, gestion d&apos;équipe, suppression</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-foreground w-24 shrink-0">Employé</span>
                    <span>Consulter et importer des documents, modifier son profil. Pas de suppression ni gestion des catégories/équipe</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </PlatformLayout>
  );
}
